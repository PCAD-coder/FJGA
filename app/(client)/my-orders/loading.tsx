import ModuleSkeleton from "../components/module-skeleton"

export default function Loading() {
  return (
    <ModuleSkeleton label="My orders" summaryCount={4} layout="cards" compact />
  )
}
