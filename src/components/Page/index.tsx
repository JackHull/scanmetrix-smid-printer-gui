import Navigation from "../Navigation"
import { styled } from "styled-components"

const StyledPage = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 80px 1fr;
  
    #content {
      box-sizing: border-box;
      padding: 32px;
    }
`

// @ts-ignore
export default props => {
    return <StyledPage>
        <Navigation />
        <div id="content">
            {props.children}
        </div>
    </StyledPage>
}
