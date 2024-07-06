import SectionWrapper from '../../common/SectionWrapper'
import HeroBanner from './HeroBanner'
import HomeBody from './HomeBody'
import Search from './Search'
const Home = () => {
  return (
    <SectionWrapper>
      <Search />
      <HeroBanner />

      <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-3'>
        <HomeBody />
        <HomeBody />
        <HomeBody />
        <HomeBody />
        <HomeBody />
        <HomeBody />
        <HomeBody />
        <HomeBody />
        <HomeBody />
      </div>
    </SectionWrapper>
  )
}

export default Home