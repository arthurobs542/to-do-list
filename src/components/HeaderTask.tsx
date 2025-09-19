export default function HeaderTask() {
  const today = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="p-4 items-center flex flex-col text-center">
      <h1 className="text-3xl font-bold text-foreground mb-6 w-full max-w-2xl ">
        A fazer
        <span className="text-muted-foreground text-2xl block pt-1">
          {" "}
          {today}
        </span>
      </h1>
    </div>
  );
}
