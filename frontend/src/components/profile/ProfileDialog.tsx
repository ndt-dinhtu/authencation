import React, { type Dispatch, type SetStateAction } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import ProfileCard from "./ProfileCard";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProfileDialogPops {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfileDialog = ({ open, setOpen }: ProfileDialogPops) => {
  const user = useAuthStore((state) => state.user);
  console.log("user: ", user);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto p-0 bg-transparent border-0 shadow-2xl">
        <div className="bg-gradient-glass">
          <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
              <div className="text-2xl font-bold text-foreground text-center">
                {" "}
                Profile && Setting
              </div>
            </div>
            <ProfileCard user={user} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
