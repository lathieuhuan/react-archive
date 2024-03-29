import { useState } from "react";
import classNames from "classnames";
import { QueryFunction, useQuery } from "react-query";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

import Card from "@Components/Card";
import { ApiData } from "./types";
import styles from "./styles.module.scss";
import { ValueFitInput } from "../tricks/AutoResizeInput";
import { useDebounce } from "@Src/hooks";

const buttonStyles = classNames(
  "w-12 h-12 bg-cyan-500 shadow-lg shadow-cyan-500/50 hover:bg-cyan-400",
  "rounded-full flex-center disabled:shadow-slate-500/50",
  styles.pageBtn
);

export default function RickAndMortyCharacters() {
  //
  const fetchCharacters: QueryFunction<ApiData> = async ({ queryKey }) => {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?page=${queryKey[1]}`
    );
    return response.json();
  };

  const [page, setPage] = useState(1);
  const debouncedPage = useDebounce(page, 500);

  const { data, isLoading, isError, isPreviousData } = useQuery<ApiData>(
    ["characters", debouncedPage],
    fetchCharacters,
    {
      keepPreviousData: true,
    }
  );

  return (
    <div className="px-8 flex flex-col">
      <h1 className="mb-2 text-purple-600 text-3xl font-semibold">
        Rick and Morty Characters
      </h1>
      <p className="text-sm">Page {page}</p>

      <div className="mt-2 mb-4 mx-auto flex gap-4">
        <button
          className={buttonStyles}
          disabled={isPreviousData || page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          <CaretLeftOutlined
            className={classNames(styles.pageCaret, styles.left)}
          />
        </button>

        <ValueFitInput
          className="hide-spin-button"
          type="number"
          min={1}
          max={data?.info.pages}
          value={page}
          onChange={(e) => {
            const newValue = +e.target.value;
            if (newValue > 0 && newValue <= (data?.info.pages || Infinity)) {
              setPage(newValue);
            }
          }}
        />

        <button
          className={buttonStyles}
          disabled={isPreviousData || !data?.info.next}
          onClick={() => setPage((prev) => prev + 1)}
        >
          <CaretRightOutlined
            className={classNames(styles.pageCaret, styles.right)}
          />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {data?.results.map((character) => {
          return (
            <Card key={character.id}>
              <h3 className="text-xl text-green-400">{character.name}</h3>
              <p>
                {character.gender} - {character.species}
              </p>
              <p>Origin: {character.origin.name}</p>
              <p>Status: {character.status}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
