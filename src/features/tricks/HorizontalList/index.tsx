import styles from "./styles.module.scss";

export const HorizontalList = () => {
  return (
    <div>
      <p className="text-3xl font-bold">Articles</p>
      <p className="text-sm italic text-slate-600">CSS tricks homepage popular articles (24/11/2022)</p>
      <div className={"mt-4 pr-8 overflow-hidden " + styles.wrapper}>
        <div className={"pl-8 py-8 flex gap-4 relative overflow-x-scroll no-scrollbar " + styles["article-list"]}>
          {[...Array(6)].map((_, i) => {
            const index = i + 1;
            return (
              <article
                key={i}
                className={"rounded-2xl p-6 flex flex-col shadow-sm text-white shrink-0 duration-200 " + styles.article}
              >
                <p className="text-sm">{index}/11/2022</p>
                <h3 className="mt-2 text-xl text-inherit font-medium">Title {index}</h3>
                <p className="mt-2 space-x-4 text-orange-400 text-sm font-medium">
                  <span className="inline-block px-3 py-1 rounded-md bg-black">Tag {index}</span>
                  <span className="inline-block px-3 py-1 rounded-md bg-black">Tag {index + 1}</span>
                </p>
                <p className="mt-auto">Author {index}</p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
