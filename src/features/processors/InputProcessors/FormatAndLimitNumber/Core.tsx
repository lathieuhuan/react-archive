import {ChangeEventHandler, FocusEventHandler, forwardRef, KeyboardEventHandler, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {LoadingOutlined, MinusOutlined, PlusOutlined, CloseCircleFilled} from '@ant-design/icons';
import classNames from 'classnames';

import {InputInfo, IInputNumberProps} from './types';

import {
    limitFractionDigits,
    initInputInfo,
    validateInputInfo,
    convertToInputValue,
    mergeRefs
} from './utils';

import styles from './styles.module.scss';

const MAXIMUM = Math.pow(10, 12);
const ALLOWED_KEYS = ['Backspace', 'Delete', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Shift'];

const CONFIG_DECIMAL_NUMBER = {
  decimalSeparator: '.',
  groupingSeparator: ',',
}

export const InputNumber = forwardRef<HTMLInputElement, IInputNumberProps>(({
    value,
    maxValue,
    minValue,
    groupingSeparator,
    decimalSeparator,
    maxFractionalDigits = 0,
    exceedMaxDigitsAction = 'prevent',
    upDownStep = 0,
    changeMode = 'onChange',
    validateMode = 'onChangePrevent',
    enterActions = [],
    className,
    loading,
    disabled,
    allowClear = false,
    allowEmpty = false,
    shouldFitValue = false,
    controllers = [],
    style,
    renderSuffix,
    onBlur,
    onFocus,
    onKeyDown,
    onChangeValue,
    onValidateFailed,
    ...rest
}, ref) => {
    const [inputValue, setInputValue] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);
    const runAfterPaint = useRunAfterPaint();

    const format = {
        groupingSeparator: groupingSeparator || CONFIG_DECIMAL_NUMBER.groupingSeparator,
        decimalSeparator: decimalSeparator || CONFIG_DECIMAL_NUMBER.decimalSeparator
    };
    const validateFraction = {
        maxFractionalDigits: Math.max(maxFractionalDigits, 0),
        exceedMaxDigitsAction
    };
    const validate = {
        minValue: minValue !== undefined ? limitFractionDigits(minValue, validateFraction).newValue : 0,
        maxValue: maxValue !== undefined ? limitFractionDigits(maxValue, validateFraction).newValue : MAXIMUM,
        ...validateFraction,
        validateMode
    };
    const isValidateOnBlur = validateMode === 'onBlur';

    if (validate.maxValue < validate.minValue) {
        validate.maxValue = validate.minValue;
    }

    const updateValue = (newValue: number) => {
        if (newValue !== value && typeof onChangeValue === 'function') {
            onChangeValue(newValue);
        }
    };

    // sync with value and validate
    useEffect(() => {
        if (value === undefined || validate === null || isNaN(value)) {
            return;
        }
        if (value === 0 && inputValue === '' && inputRef.current === document.activeElement) {
            return;
        }

        let newInputValue = convertToInputValue(
            {
                value,
                trailingZeroDigits: 0,
                withDecimalSeparator: false,
                cursorMoves: MAXIMUM
            },
            format,
            validate
        );

        const inputInfo = initInputInfo(newInputValue, format);

        validateInputInfo(inputInfo, {
            ...validate,
            validateMode: 'onChangeSetBack' // set back when out of range
        });

        newInputValue = convertToInputValue(inputInfo, format, validate);

        if (newInputValue !== inputValue) {
            setInputValue(convertToInputValue(inputInfo, format, validate));
    
            // sync value with inputValue (?)
            updateValue(inputInfo.value);
        }
    }, [value, validate.minValue, validate.maxValue, validate.maxFractionalDigits]);

    const update = (inputInfo: InputInfo, newCursor: number | null) => {
        const newInputValue = convertToInputValue(inputInfo, format, validate);
      
        if (newInputValue !== inputValue) {
            setInputValue(newInputValue);
  
            if (changeMode === 'onChange') {
                updateValue(inputInfo.value);
            }

            // update cursor position
            runAfterPaint(() => {
                if (newCursor !== null) {
                    // keep cursor after 0 (0 is intended to not be removed)
                    if (['0', '-0'].includes(newInputValue)) {
                        newCursor++;
                    }
                    else {
                        newCursor += inputInfo.cursorMoves;
                    }
                    newCursor = Math.max(newCursor, 0);
                }
                inputRef.current?.setSelectionRange(newCursor, newCursor);
            });
        }
    };

    const changeInputValueByStep = (isIncrease: boolean) => {
        if (!upDownStep) {
            return;
        }
        try {
            const inputInfo = initInputInfo(inputValue, format);
            let validatedStep = Math.max(upDownStep, 0);

            if (Math.floor(validatedStep) !== validatedStep) {
                validatedStep = limitFractionDigits(upDownStep, validate).newValue;
            }

            inputInfo.value = inputInfo.value + (isIncrease ? validatedStep : -validatedStep);

            if (inputInfo.value > Math.floor(inputInfo.value) && validate.maxFractionalDigits) {
                const roundPow = Math.pow(10, validate.maxFractionalDigits);

                inputInfo.value = Math.round(inputInfo.value * roundPow) / roundPow;
            }

            if (inputInfo.value === Math.floor(inputInfo.value)) {
                inputInfo.withDecimalSeparator = false;
            }

            // prevent on all validateModes
            validateInputInfo(inputInfo, {
                ...validate,
                validateMode: 'onChangePrevent'
            });

            const newInputValue = convertToInputValue(inputInfo, format, validate);

            setInputValue(newInputValue);
            updateValue(inputInfo.value);
            
        } catch (error) {
            //
        }
    };
  
    const onChangeInputValue: ChangeEventHandler<HTMLInputElement> = (e) => {
        const {value, selectionStart} = e.target;

        try {
            if (['-', ''].includes(value)) {
                setInputValue(value);

                if (changeMode === 'onChange' && typeof onChangeValue === 'function') {
                    onChangeValue(0);
                }
                return;
            }
            // if (value === '') {
            //     setInputValue('');
            //     return;
            // }

            const inputInfo = initInputInfo(value, format);

            if (isValidateOnBlur) {
                // default validate
                validateInputInfo(inputInfo, {
                    maxValue: MAXIMUM,
                    minValue: -MAXIMUM,
                    maxFractionalDigits: validate.maxFractionalDigits,
                    exceedMaxDigitsAction: 'prevent',
                    validateMode: 'onChangePrevent'
                });
            } else {
                validateInputInfo(inputInfo, validate, format, onValidateFailed);
            }
            
            update(inputInfo, selectionStart);
        } catch (error) {
            //
        }
    };

    const onFocusInput: FocusEventHandler<HTMLInputElement> = (e) => {
        if (typeof onFocus === 'function') {
            onFocus(e);
        }
        if (inputValue === '0') {
            setInputValue('');
        } else {
            inputRef.current?.setSelectionRange(0, 20);
        }
    };

    const onBlurInput: FocusEventHandler<HTMLInputElement> = (e) => {
        if (typeof onBlur === 'function') {
            onBlur(e);
        }
        try {
            const inputInfo = initInputInfo(inputValue, format);

            if (isValidateOnBlur) {
                validateInputInfo(inputInfo, {
                    ...validate,
                    validateMode: 'onChangeSetBack' // set back when out of range
                });
            }
            if (changeMode === 'onBlur') {
                updateValue(inputInfo.value);
            }

            let newInputValue = convertToInputValue(
                {
                    ...inputInfo,
                    trailingZeroDigits: 0,
                    withDecimalSeparator: false
                },
                format,
                validate
            );

            if (newInputValue === '0' && allowEmpty) {
                newInputValue = '';
            }

            setInputValue(newInputValue);
        } catch (error) {
            //
        }
    };

    // fired before onChangeInputValue, preventDefault will not lead to onChangeInputValue
    const onKeyDownInput: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (typeof onKeyDown === 'function') {
            onKeyDown(e);
        }

        if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
            changeInputValueByStep(e.key === 'ArrowUp');
            return;
        }
        if (e.key === 'Enter' && enterActions.length) {
            const inputInfo = initInputInfo(inputValue, format);

            const validateOnEnter = () => {
                validateInputInfo(inputInfo, {
                    ...validate,
                    validateMode: 'onChangeSetBack'
                });

                const newInputValue = convertToInputValue(inputInfo, format, validate);
    
                if (newInputValue !== inputValue) {
                    setInputValue(newInputValue);
                }
            };

            if (enterActions.includes('changeValue')) {
                if (changeMode === 'onBlur') {
                    validateOnEnter();
                    updateValue(inputInfo.value);
                }
            }
            else if (enterActions.includes('validate')) {
                if (isValidateOnBlur) {
                    validateOnEnter();
                }
            }
            else if (enterActions.includes('blur')) {
                inputRef.current?.blur();
            }

            return;
        }
        // allow all ctrl + key
        if (e.ctrlKey) {
            return;
        }
        // selectionStart, selectionEnd when before any action
        const {value: beforeInputValue, selectionStart, selectionEnd} = e.currentTarget;

        if (e.key === '-') {
            // only allow '-' at the start when min is negative
            if (validate.minValue < 0 && selectionStart === 0) {
                return;
            }
        }
        else if (e.key === format.decimalSeparator) {
            if (validate.maxFractionalDigits > 0) {
                return;
            }
        }
        else if ((/[0-9]/g).test(e.key) || ALLOWED_KEYS.includes(e.key)) {
            if (selectionStart) {
                // prevent removing groupingSeparator
                if (
                    (e.key === 'Backspace' && beforeInputValue.slice(selectionStart - 1, selectionStart) === format.groupingSeparator) ||
                    (e.key === 'Delete' && beforeInputValue.slice(selectionStart, selectionStart + 1) === format.groupingSeparator) ||
                    (selectionEnd && e.key === 'Backspace' && beforeInputValue.slice(selectionStart, selectionEnd) === format.groupingSeparator)
                ) {
                    e.preventDefault();
                }
            }
            return;
        }
        e.preventDefault();
    };

    const onClickClearIcon = () => {
        const inputInfo = {
            value: 0,
            trailingZeroDigits: 0,
            withDecimalSeparator: false,
            cursorMoves: 0
        };

        validateInputInfo(inputInfo, validate, format, onValidateFailed);

        update(inputInfo, null);
    };

    const ctrlersDisabled = [disabled || controllers[0]?.disabled, disabled || controllers[1]?.disabled];

    return (
        <div className='relative flex'>
            <div className={classNames('absolute z-10 w-full h-full items-center justify-center bg-zinc-100/40', loading ? 'flex' : 'hidden' )}>
                <LoadingOutlined />
            </div>
            {
                controllers[0] ? (
                    <button
                        className='mr-1 flex flex-none items-center justify-center w-7 h-7 rounded bg-black-100 disabled:bg-ink-100'
                        disabled={ctrlersDisabled[0]}
                        onClick={() => changeInputValueByStep(false)}
                    >
                        <MinusOutlined className={classNames({'opacity-40': ctrlersDisabled[0]})} />
                    </button>
                ) : null
            }
            <div className="flex flex-row flex-grow items-center">
                <div
                    className={classNames('flex-grow', shouldFitValue && styles['input-wrapper'], shouldFitValue && className)}
                    data-value={inputValue || '0'}
                    style={shouldFitValue ? style : undefined}
                >
                    <input
                        ref={mergeRefs(inputRef, ref)}
                        // class input-number for targeting in cart-container
                        className={classNames('input-number outline-0', !shouldFitValue && className)}
                        value={inputValue}
                        disabled={disabled}
                        {...rest}
                        onChange={onChangeInputValue}
                        onFocus={onFocusInput}
                        onBlur={onBlurInput}
                        onKeyDown={onKeyDownInput}
                        style={shouldFitValue ? undefined : style}
                    />
                </div>
                {allowClear && <CloseCircleFilled className='ml-1 text-ink-300' onClick={onClickClearIcon} />}
                {typeof renderSuffix === 'function' && renderSuffix()}
            </div>
            {
                controllers[1] ? (
                    <button
                        onClick={() => changeInputValueByStep(true)}
                        disabled={ctrlersDisabled[1]}
                        className='ml-1 flex flex-none items-center justify-center w-7 h-7 rounded bg-black-100 disabled:bg-ink-100'
                    >
                        <PlusOutlined className={classNames({'opacity-40': ctrlersDisabled[1]})} />
                    </button>
                ) : null
            }
        </div>
    );
});

const useRunAfterPaint = () => {
    const afterPaintRef = useRef<(() => void) | null>(null);

    useLayoutEffect(() => {
        if (afterPaintRef.current) {
            afterPaintRef.current();
            afterPaintRef.current = null;
        }
    });
    return (fn: () => void) => (afterPaintRef.current = fn);
};
