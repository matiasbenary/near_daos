import DefaultLayout from "@/layouts/default";

export default function LoadingState() {
  return (
    <DefaultLayout>
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-foreground/50">
          Loading DAO information...
        </div>
      </div>
    </DefaultLayout>
  );
}
