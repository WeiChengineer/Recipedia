import SectionWrapper from '../../common/SectionWrapper'
import Recipes from '../Recipes'
import Search from './Search'
import { useCookies } from 'react-cookie'
const Home = () => {
  const [cookies] = useCookies();
  console.log("COOKIES : ", cookies.auth.userid)
  return (
    <SectionWrapper>
      <Search />
      <Recipes />
    </SectionWrapper>
  )
}

export default Home