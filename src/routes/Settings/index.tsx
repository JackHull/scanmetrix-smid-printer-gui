import styled from "styled-components";
import Page from "../../components/Page"
import {FloatButton, InputNumber, Select, Typography} from "antd";

const StyledContainer = styled.div`
  background: white;
  box-sizing: border-box;
  padding: 32px;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.25);
`

export default props => {
    return <Page>
        <h1 style={{ marginBottom: 16 }}>Profile konfigurieren</h1>
        <StyledContainer>

        </StyledContainer>
        <FloatButton type="primary" icon={<i className="fas fa-plus" style={{ color: "white", fontSize: 30 }} />} style={{ width: 80, height: 80, padding: 0, bottom: 32, right: 32 }} />
    </Page>
}