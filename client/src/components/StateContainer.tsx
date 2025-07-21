const StateContainer = ({ children, name }: { children: React.ReactNode, name: string }) => {
  return (
    <div className="container">
      <div className={"title--container"}>
        <div>{name}</div>
      </div>
      {children}
    </div>
  );
};

export default StateContainer;