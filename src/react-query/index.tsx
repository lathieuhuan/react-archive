import { useState } from "react";
import { QueryFunction, useQuery } from "react-query";
import { ApiData } from "./types";
import styles from "./styles.module.scss";

import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import Button from "../components/Button";
import classNames from "classnames";

const buttonStyles = classNames(
  "w-12 h-12 bg-cyan-500 shadow-lg shadow-cyan-500/50 hover:bg-cyan-400 group",
  "rounded-full flex justify-center items-center",
  "disabled:bg-slate-500 disabled:cursor-default disabled:shadow-slate-500/50",
  styles.pageBtn
);

export default function RickAndMortyCharacters() {
  const [page, setPage] = useState(1);

  const fetchCharacters: QueryFunction<ApiData> = async ({ queryKey }) => {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?page=${queryKey[1]}`
    );
    return response.json();
  };

  const { data, status } = useQuery<ApiData>(
    ["characters", page],
    fetchCharacters
  );

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <div className="px-8 py-4 flex flex-col">
      <h1 className="mb-2 text-purple-700 text-3xl font-semibold">
        Rick and Morty Characters
      </h1>
      <p className="text-sm">Page {page}</p>

      <div className="mt-2 mb-4 mx-auto flex gap-4">
        <Button
          className={buttonStyles}
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          <CaretLeftOutlined
            className={classNames(styles.pageCaret, styles.left)}
          />
        </Button>
        <Button
          className={buttonStyles}
          onClick={() => setPage((prev) => prev + 1)}
        >
          <CaretRightOutlined
            className={classNames(styles.pageCaret, styles.right)}
          />
        </Button>
      </div>

      <div className="columns-2 gap-2 overflow-auto">
        {data?.results.map((character) => {
          return (
            <div
              key={character.id}
              className={classNames(
                "mb-2 p-2 break-inside-avoid bg-slate-800 text-slate-50 rounded-md",
                "flex flex-col gap-2 shadow-md shadow-green-400/50"
              )}
            >
              <h3 className="text-xl text-green-400">{character.name}</h3>
              <p>
                {character.gender} - {character.species}
              </p>
              <p>Origin: {character.origin.name}</p>
              <p>Status: {character.status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
