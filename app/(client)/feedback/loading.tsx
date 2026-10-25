import ModuleSkeleton from "../components/module-skeleton"

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-1 pt-4 sm:px-4 sm:pt-6 lg:px-6">
      <ModuleSkeleton label="Feedback" summaryCount={3} layout="feedback" />
    </div>
  )
}
