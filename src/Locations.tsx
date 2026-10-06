import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Home() {
  const [locations, setLocations] = useState<any[]>([]);
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
    } else {
      setLocations(data || []);
    }
  }

  async function addLocation() {
    if (!newLocation.trim()) return;

    const { error } = await supabase
      .from("locations")
      .insert([{ name: newLocation }]);

    if (error) {
      console.error("Insert error:", error);
    } else {
      setNewLocation("");
      loadLocations(); // refresh
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Locations</h1>

      {/* Input form */}
      <input
        type="text"
        placeholder="Enter location name"
        value={newLocation}
        onChange={(e) => setNewLocation(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <button onClick={addLocation}>Add</button>

      {/* List results */}
      <div style={{ marginTop: "20px" }}>
        {locations.map((loc: any) => (
          <p key={loc.id}>{loc.name}</p>
        ))}
      </div>
    </div>
  );
}
