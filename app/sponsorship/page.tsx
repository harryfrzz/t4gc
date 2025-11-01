"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Trash2, 
  Eye, 
  Building2, 
  User, 
  DollarSign,
  Calendar,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Share2
} from "lucide-react";
import { SponsorshipForm, Sponsor, SponsorshipTier, SponsorSubmission } from "@/types/sponsorship";

export default function SponsorshipPage() {
  const { user } = useAuth();
  const [forms, setForms] = useState<SponsorshipForm[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<SponsorshipForm | null>(null);
  const [isSponsorDialogOpen, setIsSponsorDialogOpen] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const storedForms = localStorage.getItem("sponsorshipForms");
    const storedSponsors = localStorage.getItem("sponsors");
    
    if (storedForms) setForms(JSON.parse(storedForms));
    if (storedSponsors) setSponsors(JSON.parse(storedSponsors));
  }, []);

  const isEventHoster = user?.role === "event-hoster";

  const handleSponsorSubmit = (submission: SponsorSubmission) => {
    const newSponsor: Sponsor = {
      id: Date.now(),
      ...submission,
      sponsoredAt: new Date().toISOString(),
      status: 'pending'
    };
    
    const updatedSponsors = [...sponsors, newSponsor];
    setSponsors(updatedSponsors);
    localStorage.setItem("sponsors", JSON.stringify(updatedSponsors));
    
    const updatedForms = forms.map(f => 
      f.id === submission.formId 
        ? { ...f, currentAmount: f.currentAmount + submission.amount }
        : f
    );
    setForms(updatedForms);
    localStorage.setItem("sponsorshipForms", JSON.stringify(updatedForms));
    
    setIsSponsorDialogOpen(false);
  };

  const updateSponsorStatus = (sponsorId: number, status: 'confirmed' | 'rejected') => {
    const updatedSponsors = sponsors.map(s => 
      s.id === sponsorId ? { ...s, status } : s
    );
    setSponsors(updatedSponsors);
    localStorage.setItem("sponsors", JSON.stringify(updatedSponsors));
  };

  // Regular user view
  if (!isEventHoster) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sponsorship Opportunities</h1>
        {forms.filter(f => f.status === 'active').length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No sponsorship opportunities available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {forms.filter(f => f.status === 'active').map(form => (
              <SponsorshipFormCard 
                key={form.id} 
                form={form} 
                onSponsor={() => {
                  setSelectedForm(form);
                  setIsSponsorDialogOpen(true);
                }}
              />
            ))}
          </div>
        )}
        
        {selectedForm && (
          <SponsorDialog 
            form={selectedForm}
            open={isSponsorDialogOpen}
            onOpenChange={setIsSponsorDialogOpen}
            onSubmit={(submission) => handleSponsorSubmit(submission)}
          />
        )}
      </div>
    );
  }

  // Event hoster view
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sponsorship Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage sponsorship opportunities</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Sponsorship Form
            </Button>
          </DialogTrigger>
          <CreateFormDialog 
            onSubmit={(formData) => {
              const newForm: SponsorshipForm = {
                id: Date.now(),
                ...formData,
                currentAmount: 0,
                status: 'active',
                createdAt: new Date().toISOString(),
                tiers: formData.tiers.map((t, i) => ({ ...t, id: Date.now() + i }))
              };
              const updatedForms = [...forms, newForm];
              setForms(updatedForms);
              localStorage.setItem("sponsorshipForms", JSON.stringify(updatedForms));
              setIsCreateDialogOpen(false);
            }}
          />
        </Dialog>
      </div>

      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forms">Sponsorship Forms</TabsTrigger>
          <TabsTrigger value="sponsors">Sponsors ({sponsors.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          {forms.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No sponsorship forms created yet. Create your first one!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {forms.map(form => (
                <FormManagementCard 
                  key={form.id} 
                  form={form}
                  sponsors={sponsors.filter(s => s.formId === form.id)}
                  onDelete={(id) => {
                    const updatedForms = forms.filter(f => f.id !== id);
                    setForms(updatedForms);
                    localStorage.setItem("sponsorshipForms", JSON.stringify(updatedForms));
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sponsors" className="space-y-4">
          {sponsors.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No sponsors yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sponsors.map(sponsor => (
                <SponsorCard 
                  key={sponsor.id} 
                  sponsor={sponsor}
                  form={forms.find(f => f.id === sponsor.formId)}
                  onUpdateStatus={updateSponsorStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateFormDialog({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [tiers, setTiers] = useState<Omit<SponsorshipTier, 'id'>[]>([
    { name: "Bronze", amount: 500, benefits: ["Logo on website"] },
    { name: "Silver", amount: 1000, benefits: ["Logo on website", "Social media mention"] },
    { name: "Gold", amount: 2500, benefits: ["Logo on website", "Social media mention", "Booth space"] }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      eventName,
      eventDescription,
      targetAmount: parseFloat(targetAmount),
      deadline,
      benefits: benefits.filter(b => b.trim()),
      tiers: tiers.filter(t => t.name && t.amount)
    });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create Sponsorship Form</DialogTitle>
        <DialogDescription>Set up a new sponsorship opportunity for your event</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eventName">Event Name *</Label>
          <Input
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="eventDescription">Event Description *</Label>
          <Textarea
            id="eventDescription"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount ($) *</Label>
            <Input
              id="targetAmount"
              type="number"
              min="0"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline *</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Sponsorship Benefits</Label>
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={benefit}
                onChange={(e) => {
                  const updated = [...benefits];
                  updated[index] = e.target.value;
                  setBenefits(updated);
                }}
                placeholder={`Benefit ${index + 1}`}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setBenefits(benefits.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setBenefits([...benefits, ""])}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Benefit
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Sponsorship Tiers</Label>
          {tiers.map((tier, index) => (
            <Card key={index}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={tier.name}
                    onChange={(e) => {
                      const updated = [...tiers];
                      updated[index].name = e.target.value;
                      setTiers(updated);
                    }}
                    placeholder="Tier name"
                  />
                  <Input
                    type="number"
                    min="0"
                    value={tier.amount}
                    onChange={(e) => {
                      const updated = [...tiers];
                      updated[index].amount = parseFloat(e.target.value);
                      setTiers(updated);
                    }}
                    placeholder="Amount"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setTiers(tiers.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setTiers([...tiers, { name: "", amount: 0, benefits: [] }])}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Tier
          </Button>
        </div>

        <Button type="submit" className="w-full">Create Form</Button>
      </form>
    </DialogContent>
  );
}

function SponsorshipFormCard({ form, onSponsor }: { form: SponsorshipForm; onSponsor: () => void }) {
  const progress = (form.currentAmount / form.targetAmount) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.eventName}</CardTitle>
        <CardDescription>{form.eventDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">${form.currentAmount.toLocaleString()} / ${form.targetAmount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Deadline: {new Date(form.deadline).toLocaleDateString()}
        </div>

        <div className="space-y-1">
          <Label className="text-sm">Sponsorship Tiers:</Label>
          <div className="flex flex-wrap gap-2">
            {form.tiers.map(tier => (
              <Badge key={tier.id} variant="secondary">
                {tier.name} - ${tier.amount}
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={onSponsor} className="w-full">
          <DollarSign className="mr-2 h-4 w-4" />
          Sponsor This Event
        </Button>
      </CardContent>
    </Card>
  );
}

function SponsorDialog({ form, open, onOpenChange, onSubmit }: {
  form: SponsorshipForm;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (submission: SponsorSubmission) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<'company' | 'individual'>("company");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [tierId, setTierId] = useState<string>("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      formId: form.id,
      name,
      type,
      email,
      phone: phone || undefined,
      amount: parseFloat(amount),
      tierId: tierId ? parseInt(tierId) : undefined,
      message: message || undefined
    });
    
    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setAmount("");
    setTierId("");
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sponsor {form.eventName}</DialogTitle>
          <DialogDescription>Fill out the form to sponsor this event</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Sponsor Type *</Label>
            <Select value={type} onValueChange={(v: 'company' | 'individual') => setType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{type === 'company' ? 'Company' : 'Your'} Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier">Select Tier (Optional)</Label>
            <Select value={tierId} onValueChange={setTierId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a tier or custom amount" />
              </SelectTrigger>
              <SelectContent>
                {form.tiers.map(tier => (
                  <SelectItem key={tier.id} value={tier.id.toString()}>
                    {tier.name} - ${tier.amount}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Sponsorship Amount ($) *</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Any message or questions..."
            />
          </div>

          <Button type="submit" className="w-full">Submit Sponsorship</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormManagementCard({ form, sponsors, onDelete }: {
  form: SponsorshipForm;
  sponsors: Sponsor[];
  onDelete: (id: number) => void;
}) {
  const progress = (form.currentAmount / form.targetAmount) * 100;
  const confirmedSponsors = sponsors.filter(s => s.status === 'confirmed');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{form.eventName}</CardTitle>
            <CardDescription>{form.eventDescription}</CardDescription>
          </div>
          <Badge variant={form.status === 'active' ? 'default' : 'secondary'}>
            {form.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">${form.currentAmount.toLocaleString()} / ${form.targetAmount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{progress.toFixed(1)}% funded</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>{sponsors.length} sponsors</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(form.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        {confirmedSponsors.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm">Confirmed Sponsors:</Label>
            <div className="space-y-1">
              {confirmedSponsors.map(sponsor => (
                <div key={sponsor.id} className="flex items-center gap-2 text-sm">
                  {sponsor.type === 'company' ? (
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <User className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="font-medium">{sponsor.name}</span>
                  <span className="text-muted-foreground">- ${sponsor.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const shareUrl = `${window.location.origin}/sponsorship?form=${form.id}`;
              navigator.clipboard.writeText(shareUrl);
              alert('Link copied to clipboard!');
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(form.id)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SponsorCard({ sponsor, form, onUpdateStatus }: {
  sponsor: Sponsor;
  form?: SponsorshipForm;
  onUpdateStatus: (id: number, status: 'confirmed' | 'rejected') => void;
}) {
  const getStatusIcon = () => {
    switch (sponsor.status) {
      case 'confirmed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (sponsor.status) {
      case 'confirmed': return 'bg-green-50 border-green-200';
      case 'rejected': return 'bg-red-50 border-red-200';
      default: return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <Card className={getStatusColor()}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {sponsor.type === 'company' ? (
                <Building2 className="h-5 w-5 text-muted-foreground" />
              ) : (
                <User className="h-5 w-5 text-muted-foreground" />
              )}
              <h3 className="font-semibold text-lg">{sponsor.name}</h3>
              <Badge variant="outline" className="ml-auto">
                {sponsor.type}
              </Badge>
            </div>
            
            {form && (
              <p className="text-sm text-muted-foreground">Event: {form.eventName}</p>
            )}
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <span className="ml-2 font-medium">${sponsor.amount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <span className="ml-2">{new Date(sponsor.sponsoredAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2">{sponsor.email}</span>
              </div>
              {sponsor.phone && (
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="ml-2">{sponsor.phone}</span>
                </div>
              )}
            </div>

            {sponsor.message && (
              <div className="mt-2 p-2 bg-white/50 rounded border">
                <p className="text-sm"><strong>Message:</strong> {sponsor.message}</p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-4">
              {getStatusIcon()}
              <span className="text-sm font-medium capitalize">{sponsor.status}</span>
            </div>
          </div>

          {sponsor.status === 'pending' && (
            <div className="flex gap-2 ml-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onUpdateStatus(sponsor.id, 'confirmed')}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Confirm
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onUpdateStatus(sponsor.id, 'rejected')}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
