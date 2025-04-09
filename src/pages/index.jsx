import CustomCarousel from "@/components/core/carrousel"
import CustomVerticalCarousel from "@/components/core/CustomVerticalCarousel"
import Description from "@/components/home/Description"
import HeroHeader from "@/components/home/HeroHeader"

const Home = () => (
  <main className="flex-1">
    <HeroHeader />
    <CustomCarousel />
    <Description />
    <CustomVerticalCarousel />
  </main>
)

export default Home
