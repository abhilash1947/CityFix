import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setUser(data.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profile) {
        setName(profile.name || "");
        setPhone(profile.phone || "");
      }
    }
  }

  async function saveProfile() {
    const { error } = await supabase
      .from("profiles")
      .update({ name, phone })
      .eq("id", user.id);

    if (!error) alert("Profile updated!");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Name</label>
          <input
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Phone</label>
          <input
            className="border p-2 w-full rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button
          onClick={saveProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};
