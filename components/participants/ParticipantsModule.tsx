"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const mockParticipants = [
  { id: "1", name: "Alice Smith", age: 20, gender: "Female", team: "Blue Strikers", role: "Player", contact: "alice@example.com", status: "Pending" },
  { id: "2", name: "Bob Johnson", age: 25, gender: "Male", team: "Red Raptors", role: "Coach", contact: "bob@example.com", status: "Approved" },
];

export type Participant = {
  id: string;
  name: string;
  age: number;
  gender: string;
  team: string;
  role: string;
  contact: string;
  status: string;
};

const emptyForm: Omit<Participant, "id"> = {
  name: "",
  age: 0,
  gender: "",
  team: "",
  role: "",
  contact: "",
  status: "Pending",
};

export default function ParticipantsModule() {
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<{ [K in keyof typeof emptyForm]?: boolean }>({});

  const resetForm = () => { setForm(emptyForm); setErrors({}); };
  const handleOpenChange = (open: boolean) => { setAddOpen(open); if (!open) resetForm(); };

  const validate = () => {
    let errs: typeof errors = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.age || form.age < 1) errs.age = true;
    if (!form.gender.trim()) errs.gender = true;
    if (!form.team.trim()) errs.team = true;
    if (!form.role.trim()) errs.role = true;
    if (!form.contact.trim() || !/\S+@\S+\.\S+/.test(form.contact)) errs.contact = true;
    if (!form.status.trim()) errs.status = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "age" ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setParticipants((curr) => [{ id: Date.now().toString(), ...form }, ...curr]);
    handleOpenChange(false);
    toast("Participant added", { description: `${form.name} was added successfully!` });
    resetForm();
  };

  const handleApprove = (id: string) => {
    setParticipants((curr) => curr.map((p) => (p.id === id && p.status === "Pending" ? { ...p, status: "Approved" } : p)));
    const p = participants.find((p) => p.id === id);
    if (p) toast("Approved successfully", { description: `${p.name} is now approved.` });
  };

  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const participantToDelete = participants.find((p) => p.id === confirmDelete.id);

  // Edit Participant state
  const [editState, setEditState] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const participantToEdit = participants.find((p) => p.id === editState.id) || null;
  const [editForm, setEditForm] = useState(emptyForm);
  const [editErrors, setEditErrors] = useState<{ [K in keyof typeof emptyForm]?: boolean }>({});

  const openEdit = (id: string) => {
    const p = participants.find((pp) => pp.id === id);
    if (!p) return;
    setEditForm({ name: p.name, age: p.age, gender: p.gender, team: p.team, role: p.role, contact: p.contact, status: p.status });
    setEditErrors({});
    setEditState({ open: true, id });
  };
  const closeEdit = () => { setEditState({ open: false, id: null }); setEditErrors({}); };

  const validateEdit = () => {
    let errs: typeof editErrors = {};
    if (!editForm.name.trim()) errs.name = true;
    if (!editForm.age || editForm.age < 1) errs.age = true;
    if (!editForm.gender.trim()) errs.gender = true;
    if (!editForm.team.trim()) errs.team = true;
    if (!editForm.role.trim()) errs.role = true;
    if (!editForm.contact.trim() || !/\S+@\S+\.\S+/.test(editForm.contact)) errs.contact = true;
    if (!editForm.status.trim()) errs.status = true;
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEditInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: name === "age" ? Number(value) : value }));
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEdit() || !editState.id) return;
    setParticipants((curr) => curr.map((p) => (p.id === editState.id ? { ...p, ...editForm } : p)));
    toast("Participant updated", { description: `${editForm.name} was updated successfully.` });
    closeEdit();
  };

  const handleRemove = useCallback((id: string) => setConfirmDelete({ open: true, id }), []);
  const handleDeleteConfirm = useCallback(() => {
    if (participantToDelete) {
      setParticipants((curr) => curr.filter((p) => p.id !== participantToDelete.id));
      toast("Participant removed", { description: `${participantToDelete.name} was removed.` });
    }
    setConfirmDelete({ open: false, id: null });
  }, [participantToDelete]);
  const handleDeleteCancel = useCallback(() => setConfirmDelete({ open: false, id: null }), []);

  const [search, setSearch] = useState("");
  const [filterTeam, setFilterTeam] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortByTeam, setSortByTeam] = useState(false);

  // Import refs/handlers
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleImportClick = () => fileInputRef.current?.click();

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (file.name.toLowerCase().endsWith(".csv")) {
        const text = await file.text();
        const rows = parseCSV(text);
        const added = ingestRows(rows);
        toast("Imported participants", { description: `${added} row(s) added from CSV.` });
      } else if (file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls")) {
        try {
          const importer = new Function("m", "return import(m)");
          // @ts-ignore - dynamic import via Function to avoid TS module resolution
          const mod = await importer("xlsx");
          const XLSX: any = mod?.default ?? mod;
          const data = await file.arrayBuffer();
          const wb = XLSX.read(data);
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(ws, { defval: "" }) as any[];
          const rows = json.map((r: any) => Object.fromEntries(Object.entries(r).map(([k, v]) => [String(k).toLowerCase(), v])));
          const added = ingestRows(rows);
          toast("Imported participants", { description: `${added} row(s) added from Excel.` });
        } catch (err) {
          toast("Excel import unavailable", { description: "Install 'xlsx' to enable Excel import." });
        }
      } else {
        toast("Unsupported file", { description: "Please select a .csv or .xlsx file." });
      }
    } catch (err) {
      toast("Import failed", { description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function parseCSV(text: string) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return [] as any[];
    const header = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase());
    const rows: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = splitCSVLine(lines[i]);
      const obj: any = {};
      header.forEach((h, idx) => {
        obj[h] = cols[idx] ?? "";
      });
      rows.push(obj);
    }
    return rows;
  }

  function splitCSVLine(line: string): string[] {
    const result: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === "," && !inQuotes) {
        result.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    result.push(cur);
    return result.map((s) => s.trim());
  }

  function ingestRows(rows: any[]): number {
    if (!rows || rows.length === 0) return 0;
    // Normalize keys
    const normalized = rows.map((r) => {
      const obj: any = {};
      for (const [k, v] of Object.entries(r)) {
        obj[String(k).toLowerCase()] = v;
      }
      return obj;
    });
    const toAdd: Participant[] = [];
    for (const r of normalized) {
      const name = String(r.name ?? "").trim();
      const ageNum = Number(r.age ?? 0);
      const gender = String(r.gender ?? "").trim();
      const team = String(r.team ?? "").trim();
      const role = String(r.role ?? "").trim();
      const contact = String(r.contact ?? r.email ?? "").trim();
      const status = String(r.status ?? "Pending").trim() || "Pending";
      if (!name || !ageNum || !gender || !team || !role || !contact) {
        continue;
      }
      toAdd.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        age: ageNum,
        gender,
        team,
        role,
        contact,
        status: status === "Approved" ? "Approved" : "Pending",
      });
    }
    if (toAdd.length > 0) setParticipants((curr) => [...toAdd, ...curr]);
    return toAdd.length;
  }

  // Add Team state
  type TeamMemberForm = { name: string; age: number | ""; gender: string; role: string; contact: string };
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamMembersCount, setTeamMembersCount] = useState<number | "">(0);
  const [teamMembers, setTeamMembers] = useState<TeamMemberForm[]>([]);

  const resetTeamForm = () => {
    setTeamName("");
    setTeamMembersCount(0);
    setTeamMembers([]);
  };

  const handleTeamOpenChange = (open: boolean) => {
    setTeamOpen(open);
    if (!open) resetTeamForm();
  };

  const handleTeamCountChange = (val: string) => {
    const num = Number(val);
    if (!Number.isFinite(num) || num < 0) return;
    setTeamMembersCount(num);
    setTeamMembers((prev) => {
      const next = [...prev];
      if (num > next.length) {
        while (next.length < num) {
          next.push({ name: "", age: "", gender: "", role: "Player", contact: "" });
        }
      } else if (num < next.length) {
        next.length = num;
      }
      return next;
    });
  };

  const updateTeamMember = (idx: number, patch: Partial<TeamMemberForm>) => {
    setTeamMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)));
  };

  const submitTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !teamMembersCount || teamMembers.length !== teamMembersCount) return;
    // Basic validation for each member
    for (const m of teamMembers) {
      if (!m.name.trim() || !m.age || Number(m.age) < 1 || !m.gender || !m.role || !m.contact.trim()) {
        toast("Please complete all member fields", { description: "Fill name, age, gender, role, contact for each member." });
        return;
      }
    }
    const newParticipants: Participant[] = teamMembers.map((m) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: m.name,
      age: Number(m.age),
      gender: m.gender,
      team: teamName.trim(),
      role: m.role,
      contact: m.contact,
      status: "Pending",
    }));
    setParticipants((curr) => [...newParticipants, ...curr]);
    handleTeamOpenChange(false);
    toast("Team added", { description: `${teamName} with ${newParticipants.length} member(s) added.` });
  };

  const uniqueTeams = useMemo(() => Array.from(new Set(participants.map((p) => p.team))), [participants]);
  const filteredParticipants = useMemo(
    () => {
      const base = participants.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
        const teamMatch = !filterTeam || p.team === filterTeam;
        const statusMatch = filterStatus === "All" || p.status === filterStatus;
        return nameMatch && teamMatch && statusMatch;
      });
      if (!sortByTeam) return base;
      return [...base].sort((a, b) => a.team.localeCompare(b.team));
    },
    [participants, search, filterTeam, filterStatus, sortByTeam]
  );

  // Remove JSON export; keep CSV only
  function exportCSV() {
    if (filteredParticipants.length === 0) return;
    const data = filteredParticipants;
    const keys = Object.keys(data[0]);
    const rows = [keys.join(","), ...data.map((row) => keys.map((k) => `"${String((row as any)[k] ?? "").replace(/"/g, '""')}"`).join(","))];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participants-${new Date().toISOString().slice(0, 16).replace(/:|T/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    toast("Exported participants as CSV", { description: `${filteredParticipants.length} row(s) exported.` });
  }

  const handleInlineStatusChange = (id: string, status: "Pending" | "Approved") => {
    setParticipants((curr) => curr.map((p) => (p.id === id ? { ...p, status } : p)));
    const p = participants.find((pp) => pp.id === id);
    if (p) toast("Status updated", { description: `${p.name} set to ${status}.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold">Participants</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTeamOpen(true)}>Add Team</Button>
          <Button onClick={() => setAddOpen(true)}>Add Participant</Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-2 mt-2 items-end">
        <div>
          <label htmlFor="search" className="block text-xs font-medium mb-1">Search Name</label>
          <Input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." className="w-44" />
        </div>
        <div>
          <label htmlFor="team" className="block text-xs font-medium mb-1">Team</label>
          <select id="team" value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)} className="border rounded px-2 py-1 text-sm h-9">
            <option value="">All Teams</option>
            {uniqueTeams.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-xs font-medium mb-1">Status</label>
          <select id="status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded px-2 py-1 text-sm h-9">
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
          </select>
        </div>
        <div className="flex items-end gap-2 ml-auto">
          <Button type="button" variant="outline" onClick={() => setSortByTeam((v) => !v)}>
            {sortByTeam ? "Unsort teams" : "Sort by team"}
          </Button>
          <Button type="button" variant="outline" onClick={exportCSV} disabled={filteredParticipants.length === 0}>
            Export CSV
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelected} className="hidden" />
          <Button type="button" variant="outline" onClick={handleImportClick}>
            Import
          </Button>
        </div>
      </div>
      <Card className="p-3">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Age</th>
                <th className="px-4 py-2 text-left">Gender</th>
                <th className="px-4 py-2 text-left">Team</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((p) => (
                <tr key={p.id} className="border-b hover:bg-neutral-50">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.age}</td>
                  <td className="px-4 py-2">{p.gender}</td>
                  <td className="px-4 py-2">{p.team}</td>
                  <td className="px-4 py-2">{p.role}</td>
                  <td className="px-4 py-2">{p.contact}</td>
                  <td className="px-4 py-2">
                    <select
                      value={p.status}
                      onChange={(e) => handleInlineStatusChange(p.id, e.target.value as any)}
                      className="border rounded px-2 py-1 text-sm h-9"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p.id)}>
                      Edit
                    </Button>
                    <Button size="sm" disabled={p.status !== "Pending"} onClick={() => handleApprove(p.id)} variant="secondary">
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRemove(p.id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredParticipants.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No participants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Drawer open={addOpen} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-w-md mx-auto h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Add Participant</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pt-2 pb-3 overflow-y-auto flex-1">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <Input id="name" name="name" value={form.name} onChange={handleInput} className={errors.name ? "border-red-500 focus:border-red-500" : ""} required />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium">
                  Age
                </label>
                <Input id="age" name="age" type="number" min={1} value={form.age || ""} onChange={handleInput} className={errors.age ? "border-red-500 focus:border-red-500" : ""} required />
              </div>
              <div>
                <span className="block text-sm font-medium">Gender</span>
                <div className="flex gap-2 mt-1">
                  {(["Male", "Female", "Other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, gender: g }))}
                      className={
                        `px-3 py-1.5 rounded-full text-sm border transition ` +
                        (form.gender === g ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100")
                      }
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-sm font-medium">Role</span>
                <div className="flex gap-2 mt-1">
                  {(["Player", "Coach", "Volunteer"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, role: r }))}
                      className={
                        `px-3 py-1.5 rounded-full text-sm border transition ` +
                        (form.role === r ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100")
                      }
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="team" className="block text-sm font-medium">
                  Team
                </label>
                <Input id="team" name="team" value={form.team} onChange={handleInput} className={errors.team ? "border-red-500 focus:border-red-500" : ""} required />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium">
                  Email
                </label>
                <Input id="contact" name="contact" type="email" value={form.contact} onChange={handleInput} className={errors.contact ? "border-red-500 focus:border-red-500" : ""} required />
              </div>
              {/* Status field removed for Add form (defaults to Pending) */}
              <div className="h-2" />
              <div className="flex gap-2 sticky bottom-0 bg-white pt-2 pb-1">
                <Button type="submit">Add</Button>
                <Button variant="outline" type="button" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Add Team Drawer */}
      <Drawer open={teamOpen} onOpenChange={handleTeamOpenChange}>
        <DrawerContent className="max-w-2xl mx-auto h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Add Team</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pt-2 pb-3 overflow-y-auto flex-1">
            <form className="space-y-4" onSubmit={submitTeam}>
              <div>
                <label htmlFor="team-name" className="block text-sm font-medium">Team Name</label>
                <Input id="team-name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="team-count" className="block text-sm font-medium">Number of Members</label>
                <Input id="team-count" type="number" min={0} value={teamMembersCount} onChange={(e) => handleTeamCountChange(e.target.value)} className="mt-1" />
              </div>
              {teamMembers.map((m, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="font-medium mb-3">Member {idx + 1}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <Input value={m.name} onChange={(e) => updateTeamMember(idx, { name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Age</label>
                      <Input type="number" min={1} value={m.age} onChange={(e) => updateTeamMember(idx, { age: Number(e.target.value) })} />
                    </div>
                    <div>
                      <span className="block text-sm font-medium">Gender</span>
                      <div className="flex gap-2 mt-1">
                        {(["Male", "Female", "Other"] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => updateTeamMember(idx, { gender: g })}
                            className={
                              `px-3 py-1.5 rounded-full text-sm border transition ` +
                              (m.gender === g ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100")
                            }
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="block text-sm font-medium">Role</span>
                      <div className="flex gap-2 mt-1">
                        {(["Player", "Coach", "Volunteer"] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => updateTeamMember(idx, { role: r })}
                            className={
                              `px-3 py-1.5 rounded-full text-sm border transition ` +
                              (m.role === r ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100")
                            }
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium">Email</label>
                      <Input type="email" value={m.contact} onChange={(e) => updateTeamMember(idx, { contact: e.target.value })} />
                    </div>
                  </div>
                </div>
              ))}
              <div className="h-2" />
              <div className="flex gap-2 sticky bottom-0 bg-white pt-2 pb-1 justify-end">
                <Button type="button" variant="outline" onClick={() => handleTeamOpenChange(false)}>Cancel</Button>
                <Button type="submit">Add Team</Button>
              </div>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
      <Dialog open={confirmDelete.open} onOpenChange={(open) => { if (!open) handleDeleteCancel() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Participant</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently remove
              <span className="font-semibold"> {participantToDelete ? participantToDelete.name : ""}</span>?<br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4 justify-end">
            <Button variant="outline" onClick={handleDeleteCancel} type="button">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} type="button">
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={editState.open} onOpenChange={(open) => { if (!open) closeEdit() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Participant</DialogTitle>
            <DialogDescription>Update participant details and save changes.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitEdit}>
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium">
                Name
              </label>
              <Input id="edit-name" name="name" value={editForm.name} onChange={handleEditInput} className={editErrors.name ? "border-red-500 focus:border-red-500" : ""} required />
            </div>
            <div>
              <label htmlFor="edit-age" className="block text-sm font-medium">
                Age
              </label>
              <Input id="edit-age" name="age" type="number" min={1} value={editForm.age || ""} onChange={handleEditInput} className={editErrors.age ? "border-red-500 focus:border-red-500" : ""} required />
            </div>
            <div>
              <span className="block text-sm font-medium">Gender</span>
              <div className="flex gap-2 mt-1">
                {(["Male", "Female", "Other"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setEditForm((f) => ({ ...f, gender: g }))}
                    className={
                      `px-3 py-1.5 rounded-full text-sm border transition ` +
                      (editForm.gender === g ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100")
                    }
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="block text-sm font-medium">Role</span>
              <div className="flex gap-2 mt-1">
                {(["Player", "Coach", "Volunteer"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setEditForm((f) => ({ ...f, role: r }))}
                    className={
                      `px-3 py-1.5 rounded-full text-sm border transition ` +
                      (editForm.role === r ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100")
                    }
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="edit-team" className="block text-sm font-medium">
                Team
              </label>
              <Input id="edit-team" name="team" value={editForm.team} onChange={handleEditInput} className={editErrors.team ? "border-red-500 focus:border-red-500" : ""} required />
            </div>
            <div>
              <label htmlFor="edit-contact" className="block text-sm font-medium">
                Email
              </label>
              <Input id="edit-contact" name="contact" type="email" value={editForm.contact} onChange={handleEditInput} className={editErrors.contact ? "border-red-500 focus:border-red-500" : ""} required />
            </div>
            <div>
              <label htmlFor="edit-status" className="block text-sm font-medium">
                Status
              </label>
              <select id="edit-status" name="status" value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))} className="mt-1 border rounded px-2 py-2 text-sm h-9 w-full" required>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2 justify-end">
              <Button type="button" variant="outline" onClick={closeEdit}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
