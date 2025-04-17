import CustomCarousel from "@/components/core/carrousel"
import CustomVerticalCarousel from "@/components/core/CustomVerticalCarousel"
import Description from "@/components/home/Description"
import HeroHeader from "@/components/home/HeroHeader"

const Home = () => (
  <main className="flex-1">
    <HeroHeader />
    <CustomCarousel />
    <Description />
    <div className="mx-24 my-16">
      <CustomVerticalCarousel />
    </div>
  </main>
)

export default Home
