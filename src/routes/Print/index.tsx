import styled from "styled-components";
import Page from "../../components/Page"
import {Alert, FloatButton, InputNumber, Progress, Select, Typography} from "antd";
import {useEffect, useState} from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { notification } from "antd";

const StyledContainer = styled.div`
  background: white;
  box-sizing: border-box;
  padding: 32px;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.25);
  margin-top: 16px;
`

export default props => {
    const [ printing, setPrinting ] = useState(false)
    const [ progress, setProgress ] = useState(100)
    const [ api, contextHolder ] = notification.useNotification({
        stack: {threshold: 3}
    });

    useEffect(() => {
        if(printing) {
            const interval = setInterval(() => {
                setProgress(progress => {
                    if(progress === 100) {
                        clearInterval(interval)

                        setPrinting(false)
                        api.success({
                            message: "Drucken erfolgreich",
                            description: "Der Druckvorgang wurde erfolgreich beendet."
                        })

                        return progress
                    }

                    return progress + 1
                })
            }, 100)
        }
    }, [ printing ])

    return <Page>
        {contextHolder}
        <h1 style={{ marginBottom: 16 }}>Drucken</h1>
        <Alert showIcon type="info" message={<>Damit die Druckfunktion korrekt funktionieren und alle Drucker angezeigt werden können, muss <a href="https://www.zebra.com/de/de/forms/browser-print-request-pc.html" target="_blank">Zebra Browser Print</a> auf dem Gerät installiert und konfiguriert sein.</>} />
        <div style={{ width: "100%", display: "grid", gridGap: 32, gridTemplateColumns: "3fr 1fr" }}>
            <StyledContainer>
                <div style={{ display: "grid", gridAutoFlow: "row", gridGap: 16 }}>
                    <div>
                        <Typography.Title level={5}>Druckerhardware auswählen</Typography.Title>
                        <Select disabled={printing} suffixIcon={<i className="fas fa-print" />} style={{ width: "100%" }} size="large" placeholder="Zebra ZT XXX" options={[

                        ]} />
                    </div>
                    <div>
                        <Typography.Title level={5}>Profil auswählen</Typography.Title>
                        <Select disabled={printing} suffixIcon={<i className="fas fa-user" />} style={{ width: "100%" }} size="large" placeholder="Standardprofil" options={[

                        ]} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridGap: 32 }}>
                        <div>
                            <Typography.Title level={5}>Anzahl auswählen</Typography.Title>
                            <InputNumber disabled={printing} addonBefore={<i className="fas fa-qrcode" />} style={{ width: "100%" }} size="large" />
                        </div>
                        <div>
                            <Typography.Title level={5}>Startnummer</Typography.Title>
                            <InputNumber placeholder="Automatisch" disabled addonBefore={<i className="fas fa-hourglass-start" />} style={{ width: "100%" }} size="large" />
                        </div>
                        <div>
                            <Typography.Title level={5}>Endnummer</Typography.Title>
                            <InputNumber placeholder="Automatisch" disabled addonBefore={<i className="fas fa-hourglass-end" />} style={{ width: "100%" }} size="large" />
                        </div>
                    </div>
                </div>
            </StyledContainer>
            <StyledContainer style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Progress size={150} type="circle" percent={progress} />
            </StyledContainer>
        </div>
        <FloatButton onClick={() => {
            if(!printing) {
                setPrinting(true)
                setProgress(0)
            } else {
                api.warning({
                    message: "Drucken fehlgeschlagen",
                    description: "Es läuft bereits ein aktiver Druckvorgang."
                })
            }
        }} type="primary" icon={printing ? <LoadingOutlined style={{ fontSize: 24 }} spin /> : <i className="fa-duotone fa-print" style={{ color: "white", fontSize: 30 }} />} style={{ width: 80, height: 80, padding: 0, bottom: 32, right: 32 }} />
    </Page>
}