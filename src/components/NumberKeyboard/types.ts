export interface INumberKeyboardProps {
    /**
     * className của div bao ngoài cùng
     */
    wrapperClassName?: string;
    /**
     * Chiều cao keyboard không bao gồm phần suggestions. Mặc định 244px
     */
    keyboardHeight?: number | string;
    /**
     * Render các giá trị đề xuất
     */
    suggestions?: number[];
    /**
     * Render phím "000"
     */
    withTripleZeroes?: boolean;
    /**
     * Render phím dấu cách thập phân
     */
    withDecimalSeparator?: boolean;
    /**
     * Dấu cách thập phân là ',' (phẩy) khi locale: vi, là '.' (chấm) khi locale: en
     */
    locale?: 'vi' | 'en';
    /**
     * Chữ trên nút hoàn tất. Mặc đinh là 'Done'
     */
    doneText?: string;
    /**
     * Disable nút hoàn tất
     */
    isDisabledDone?: boolean;
    /**
     * Được gọi khi nhấn các phím: '0', '1'... '9', '000', và dấu cách thập phân (nếu được dùng)
     */
    onClickKey?: (key: string) => void;
    /**
     * Được gọi khi 1 giá trị đề xuất dược chọn
     */
    onClickSuggestion?: (suggestion: number, index: number) => void;
    /**
     * Được gọi khi nhấn nút xóa
     */
    onClickBackspace?: () => void;
    /**
     * Được gọi khi nhấn giữ nút xóa (chỉ trên mobile)
     */
    onHoldBackspace?: () => void;
    /**
     * Được gọi khi nhấn nút hoàn tất
     */
    onClickDone?: () => void;
}