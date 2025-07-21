export default async function Hello() {
  try {
    const res = await fetch("http://localhost:8080/hello/test", { cache: 'no-store' });

    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

    const data = await res.json();
    console.log(data);

    return (
      <div>{data.message}</div>
    );
  } catch (err) {
    console.error('Fetch error:', err);

    return (
      <div>Failed to fetch initial data!</div>
    );
  }
}