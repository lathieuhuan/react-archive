function FolderTitle({ info }) {
  return (
    <p
      onClick={() => {
        setOpenStatus((prev) => {
          const newStatus = JSON.parse(JSON.stringify(prev));
          findAndToggle(newStatus, info.id);
          return newStatus;
        });
      }}
    >
      <CaretRightOutlined
        className={classNames("mr-2 transition-all duration-300", {
          "rotate-90": openStatus.open,
        })}
      />
      {info.name}
    </p>
  );
}