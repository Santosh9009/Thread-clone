import MainCardWrapper from "@/components/cards/MainCardWrapper";
import EditUserForm from "@/components/forms/EdituserForm";

export default function EditProfile() {
  return (
    <div>
      <div className="md:h-[10vh]"></div>
      <MainCardWrapper>
        <EditUserForm/>
      </MainCardWrapper>
    </div>
  );
}