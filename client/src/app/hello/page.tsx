import UploadData from "./components/UploadData";

export default async function Hello() {
  let data;
  let error;

  try {
    const res = await fetch("http://localhost:8080/hello/test", { cache: 'no-store' });

    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

    data = await res.json();
    console.log(data);
  } catch (err) {
    error = err;
    console.error('Fetch error:', err);
  }

  return (
    <div>
      <div>{error ?  "Failed to fetch initial data!" : data.message}</div>
      <UploadData />
    </div>
  );
}