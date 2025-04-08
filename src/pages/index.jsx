import CustomCarousel from "@/components/core/carrousel"
import Description from "@/components/home/Description"
import HeroHeader from "@/components/home/HeroHeader"

const Home = () => (
  <main className="flex-1">
    <HeroHeader />
    <CustomCarousel />
    <Description />
  </main>
)

export default Home
