import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [providerType, setProviderType] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data } = await supabase.from("profiles").select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        setName(data.name || "");
        setPhone(data.phone || "");
        setProviderType(data.provider_type || "");
      }
    }
  }

  async function updateProfile() {
    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        phone,
        provider_type: providerType,
      })
      .eq("id", user.id);

    if (error) alert("Error saving profile");
    else alert("Profile updated successfully!");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Profile Info</h2>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <input
        type="text"
        placeholder="Enter phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      /><br /><br />

      <input
        type="text"
        placeholder="Provider type"
        value={providerType}
        onChange={(e) => setProviderType(e.target.value)}
      /><br /><br />

      <button onClick={updateProfile}>Save</button>
    </div>
  );
}
