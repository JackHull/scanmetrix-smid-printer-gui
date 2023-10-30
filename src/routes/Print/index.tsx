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
        <h1 style={{ marginBottom: 16 }}>Drucken</h1>
        <StyledContainer>
            <div style={{ display: "grid", gridAutoFlow: "row", gridGap: 16 }}>
                <div>
                    <Typography.Title level={4}>Druckerhardware auswählen</Typography.Title>
                    <Select suffixIcon={<i className="fas fa-print" />} style={{ width: "100%" }} size="large" placeholder="Zebra ZT XXX" options={[

                    ]} />
                </div>
                <div>
                    <Typography.Title level={4}>Anzahl auswählen</Typography.Title>
                    <InputNumber addonBefore={<i className="fas fa-qrcode" />} style={{ width: "100%" }} size="large" />
                </div>
                <div>
                    <Typography.Title level={4}>Profil auswählen</Typography.Title>
                    <Select suffixIcon={<i className="fas fa-user" />} style={{ width: "100%" }} size="large" placeholder="Standardprofil" options={[

                    ]} />
                </div>
            </div>
        </StyledContainer>
        <FloatButton type="primary" icon={<i className="fa-duotone fa-print" style={{ color: "white", fontSize: 30 }} />} style={{ width: 80, height: 80, padding: 0, bottom: 32, right: 32 }} />
    </Page>
}