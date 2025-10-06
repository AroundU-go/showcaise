import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";

const CATEGORIES = [
  "Productivity",
  "Engineering & Development", 
  "Design & Creative",
  "Finance",
  "Social & Community",
  "Marketing & Sales",
  "Health & Fitness",
  "Travel",
  "Platforms",
  "Product add-ons",
  "Web3",
  "AI Agents",
  "LLMs"
];

export default function SubmitApp() {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    website_url: "",
    maker_email: "",
    category: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setLogo(file);
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("app-assets")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("app-assets")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.tagline || !formData.description || 
        !formData.website_url || !formData.maker_email || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate URL
    try {
      new URL(formData.website_url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
        variant: "destructive",
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.maker_email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let logoUrl = null;
      
      // Upload logo if provided
      if (logo) {
        logoUrl = await uploadLogo(logo);
      }

      // Submit app
      const { error } = await supabase.from("apps").insert({
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        website_url: formData.website_url,
        maker_email: formData.maker_email,
        category: formData.category,
        logo_url: logoUrl,
        status: "pending",
      });

      if (error) throw error;

      // Send email notification to admin
      try {
        await supabase.functions.invoke("notify-new-app", {
          body: {
            appName: formData.name,
            appTagline: formData.tagline,
            appCategory: formData.category,
            makerEmail: formData.maker_email,
            websiteUrl: formData.website_url,
          },
        });
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
        // Don't fail the submission if email fails
      }

      toast({
        title: "App submitted!",
        description: "Your app has been submitted for review. We'll notify you once it's approved.",
      });

      // Redirect to home
      navigate("/");
    } catch (error) {
      console.error("Error submitting app:", error);
      toast({
        title: "Submission failed",
        description: "Failed to submit your app. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Submit Your{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                AI App
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Share your amazing AI application with the community and get discovered!
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>App Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name">App Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your app name"
                    required
                  />
                </div>

                {/* Tagline */}
                <div>
                  <Label htmlFor="tagline">Tagline *</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                    placeholder="A short, catchy description (max 60 chars)"
                    maxLength={60}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe what your app does and how it helps users..."
                    rows={4}
                    required
                  />
                </div>

                {/* Website URL */}
                <div>
                  <Label htmlFor="website">Website URL *</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => handleInputChange("website_url", e.target.value)}
                    placeholder="https://yourapp.com"
                    required
                  />
                </div>

                {/* Maker Email */}
                <div>
                  <Label htmlFor="email">Your Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.maker_email}
                    onChange={(e) => handleInputChange("maker_email", e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange("category", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Logo Upload */}
                <div>
                  <Label htmlFor="logo">Logo (Optional)</Label>
                  <div className="mt-2">
                    <label htmlFor="logo-input" className="cursor-pointer">
                      <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                        {logo ? (
                          <div className="flex flex-col items-center gap-2">
                            <img 
                              src={URL.createObjectURL(logo)} 
                              alt="Logo preview" 
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <span className="text-sm text-muted-foreground">
                              {logo.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="w-8 h-8" />
                            <span className="text-sm">Click to upload logo</span>
                            <span className="text-xs">Max 5MB, JPG/PNG</span>
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      id="logo-input"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit App for Review"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}