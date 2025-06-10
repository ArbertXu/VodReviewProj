import { useEffect, useState } from "react";

export default function VodTest() {
  const [vod, setVod] = useState([]);
  const [form, setForm] = useState({
    url: "",
    user_id: 1,
    date: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/vods")
      .then((res) => res.json())
      .then((data) => {
      console.log("Fetched VOD data:", data);
      setVod(data);
    })
      .catch((err) => console.error("Error fetching VODs Specials:", err));
  }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await fetch("http://localhost:3000/api/vods", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(form),
//     });
//     const newVod = await res.json();
//     setVods((prev) => [...prev, newVod]);
//     setForm({ user_id: 1, title: "", url: "" });
//   };



 const firstVod = vod[0];
  if (!firstVod) return <div>Loading VOD...</div>;
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Latest VOD</h2>
      <p><strong>Test:</strong> {firstVod.date_uploaded}</p>
    </div>
  );
}