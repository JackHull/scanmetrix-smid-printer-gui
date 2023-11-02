import { styled } from "styled-components"
import icon from "../../icon.svg"
import packageJSON from "../../../package.json"
import { Link, useLocation } from "react-router-dom";

const StyledNavigation = styled.nav`
    width: 100%;
    height: 100%;
    background-color: #20242b;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  
    .items {
      display: flex;
      flex-direction: column;
    }
  
    .logo {
        width: 80px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
        
        .version {
            color: white;
            margin-bottom: 16px;
            font-size: 14px;
            opacity: 0.5;
        }
      
        img {
            width: 40px;
            height: 40px;
            margin-bottom: 20px;
        }
    }
  
    .item {
        text-decoration: none;
        height: 80px;
        width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
      
        i {
            color: white;
            font-size: 24px;
            opacity: 0.3;
            transition: all 0.3s;
        }
      
        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
            
            i {
                opacity: 1;
            }
        }
      
        &.selected {
            background-color: #3b97d3;
          
            i {
                opacity: 1;
            }
        }
    }
`

export default () => {
    const location = useLocation()

    return <StyledNavigation>
        <div className="items">
            <Link to="/" className={`item ${location.pathname === "/" ? "selected" : ""}`}>
                <i className="fa-duotone fa-home" />
            </Link>
            <Link to="/prints" className={`item ${location.pathname === "/prints" ? "selected" : ""}`}>
                <i className="fa-duotone fa-history" />
            </Link>
            {/*<div className="item">
                <i className="fa-duotone fa-shopping-cart" />
            </div>*/}
            {/*<div className="item">
                <i className="fa-duotone fa-cloud-download" />
            </div>*/}
            <Link to="/settings"  className={`item ${location.pathname === "/settings" ? "selected" : ""}`}>
                <i className="fa-duotone fa-cog" />
            </Link>
        </div>
        <div className="logo">
            <p className="version">{packageJSON.version}</p>
            <img src={icon} />
        </div>
    </StyledNavigation>
}
