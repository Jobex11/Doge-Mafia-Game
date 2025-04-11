
import React from 'react';
import { MessageSquare, ExternalLink, Users } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DiscordIntegrationProps {
  className?: string;
}

const DiscordIntegration: React.FC<DiscordIntegrationProps> = ({ 
  className = ""
}) => {
  const { toast } = useToast();
  const discordInviteUrl = "https://discord.gg/dogemafia"; // replace with your actual Discord invite

  const openDiscord = () => {
    window.open(discordInviteUrl, '_blank');
    toast({
      title: "Opening Discord",
      description: "You'll be redirected to our Discord community.",
    });
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-6 md:mb-0">
          <div className="p-4 rounded-full bg-purple-500/10 mr-4">
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <div>
            <h3 className="text-xl font-display font-semibold">Discord Community</h3>
            <p className="text-muted-foreground">Join our Discord for discussions and support</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={openDiscord}
          className="flex items-center"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Join Discord Community
        </Button>
      </div>
    </Card>
  );
};

export default DiscordIntegration;
