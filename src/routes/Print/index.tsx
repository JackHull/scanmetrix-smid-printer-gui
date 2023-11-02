import styled from "styled-components";
import Page from "../../components/Page"
import {Alert, FloatButton, InputNumber, Progress, Select, Typography} from "antd";
import {useEffect, useState} from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { notification } from "antd";
import ZebraBrowserPrintWrapper from "zebra-browser-print-wrapper-global"
import moment from "moment"
const { ipcRenderer } = window.require("electron");

const StyledContainer = styled.div`
  background: white;
  box-sizing: border-box;
  padding: 32px;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.25);
  margin-top: 16px;
`

export default () => {
    const [ printers, setPrinters ] = useState([])
    const [ amount, setAmount ] = useState(0)
    const [ printer, setPrinter ] = useState(null)
    const [ profiles, setProfiles ] = useState([])
    const [ profile, setProfile ] = useState(null)
    const [ printing, setPrinting ] = useState(false)
    const [ zebraLoading, setZebraLoading ] = useState(true)
    const [ zebraError, setZebraError ] = useState(false)
    const [ progress, setProgress ] = useState(100)
    const [ api, contextHolder ] = notification.useNotification({
        stack: {threshold: 3}
    });

    const fetch = () => {
        ipcRenderer.invoke('database').then(database => {
            setProfiles(database.data.profiles)
            if(database.data.profiles.length === 1) setProfile(database.data.profiles[0])
        })
    }

    useEffect(() => {
        fetch()
    }, [])

    const connectZebra = async () => {
        setZebraLoading(true)

        // @ts-ignore
        const browserPrint = new ZebraBrowserPrintWrapper()

        try {
            await browserPrint.getDefaultPrinter()
        } catch (e) {
            setZebraLoading(false)
            setZebraError(true)
            return false
        }

        setZebraLoading(false)
        setZebraError(false)

        const printers = await browserPrint.getAvailablePrinters()

        setPrinters(printers)

        if(printers.length === 1) setPrinter(printers[0].uid)
    }

    useEffect(() => {
        connectZebra().then(() => {}).catch(() => {})
    }, [])

    return <Page>
        {contextHolder}
        <h1 style={{ marginBottom: 4 }}>SMIDs drucken</h1>
        <h2 style={{ marginBottom: 32, fontWeight: 400, fontSize: 18 }}>Drucke selbst SMIDs mit Hilfe deines Zebra® Etikettendruckers.</h2>
        {zebraLoading && <Alert showIcon type="info" message={<>Baue Verbindung zum Zebra® Druckserver auf...</>} />}
        {!zebraLoading && zebraError && <Alert showIcon type="error" message={<div style={{ userSelect: "none" }}>Die Verbindung zum Zebra® Druckserver konnte nicht aufgebaut werden. Stelle sicher, dass <a href="https://www.zebra.com/de/de/forms/browser-print-request-pc.html" target="_blank">Zebra Browser Print</a> auf dem Gerät installiert und gestartet ist. <a onClick={() => connectZebra()}>Erneut versuchen</a></div>} />}
        {!zebraLoading && !zebraError && <Alert showIcon type="success" message={<>Die Verbindung zu Zebra® Browser Print wurde erfolgreich hergestellt, bereit für den Druck.</>} />}
        <div style={{ width: "100%", display: "grid", gridGap: 32, gridTemplateColumns: "3fr 1fr" }}>
            <StyledContainer>
                <div style={{ display: "grid", gridAutoFlow: "row", gridGap: 16 }}>
                    <div>
                        <Typography.Title level={5}>Druckerhardware auswählen</Typography.Title>
                        <Select disabled={printing} value={printer} onSelect={printer => setPrinter(printer)} suffixIcon={<i className="fas fa-print" />} style={{ width: "100%" }} size="large" placeholder="Zebra ZT XXX" options={printers.map(printer => ({ value: printer.uid, label: printer.name }))} />
                    </div>
                    <div>
                        <Typography.Title level={5}>Profil auswählen</Typography.Title>
                        <Select disabled={printing || !printer} value={profile?.id} onSelect={profile => setProfile(profiles.find(p => p.id === profile.id))} suffixIcon={<i className="fas fa-user" />} style={{ width: "100%" }} size="large" placeholder="Standardprofil" options={profiles.map(profile => ({ value: profile.id, label: profile.name }))} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridGap: 32 }}>
                        <div>
                            <Typography.Title level={5}>Anzahl auswählen</Typography.Title>
                            <InputNumber disabled={printing} value={amount} onChange={amount => setAmount(amount)} addonBefore={<i className="fas fa-qrcode" />} style={{ width: "100%" }} size="large" />
                        </div>
                        <div>
                            <Typography.Title level={5}>Startnummer</Typography.Title>
                            <InputNumber placeholder="Automatisch" value={profile?.currentNumber} disabled addonBefore={<i className="fas fa-hourglass-start" />} style={{ width: "100%" }} size="large" />
                        </div>
                        <div>
                            <Typography.Title level={5}>Endnummer</Typography.Title>
                            <InputNumber placeholder="Automatisch" value={profile ? (profile.currentNumber + amount - 1) : null} disabled addonBefore={<i className="fas fa-hourglass-end" />} style={{ width: "100%" }} size="large" />
                        </div>
                    </div>
                </div>
            </StyledContainer>
            <StyledContainer style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Progress size={150} type="circle" percent={progress} />
            </StyledContainer>
        </div>
        {printer && amount > 0 && profile && !zebraLoading && !zebraError && <FloatButton onClick={async () => {
            if(!printing) {
                setPrinting(true)
                setProgress(0)

                // @ts-ignore
                const browserPrint = new ZebraBrowserPrintWrapper()

                const printers = await browserPrint.getAvailablePrinters()
                // @ts-ignore
                const zebraPrinter = printers.find(p => p.uid === printer)

                if(!zebraPrinter) {
                    setPrinting(false)

                    setProgress(100)

                    return api.error({
                        message: "Drucken fehlgeschlagen",
                        description: "Der Drucker ist nicht mehr verbunden. Bitte versuchen Sie, Zebra® Browser Print neuzustarten."
                    })
                }

                browserPrint.setPrinter(zebraPrinter)

                console.log(zebraPrinter)

                const status = await browserPrint.checkPrinterStatus()

                if(!status.isReadyToPrint) {
                    setPrinting(false)

                    setProgress(100)

                    return api.error({
                        message: "Drucken fehlgeschlagen",
                        description: "Der Drucker ist nicht bereit (" + status.errors + "). Bitte versuchen Sie, Zebra® Browser Print neuzustarten."
                    })
                }

                const cnt = profile.currentNumber

                ipcRenderer.invoke('database').then(database => {
                    database.data.prints.push({
                        profile: profile.id,
                        printer,
                        amount,
                        startNumber: profile.currentNumber,
                        endNumber: profile.currentNumber + amount,
                        date: moment().format("DD.MM.YYYY HH:mm")
                    })

                    // @ts-ignore
                    database.data.profiles = database.data.profiles.map(p => {
                        if(p.id !== profile.id) return p

                        return Object.assign(p, { currentNumber: profile.currentNumber + amount })
                    })

                    setProfiles(database.data.profiles)

                    ipcRenderer.invoke('save-database', database.data).then(async () => {
                        for(let i = profile.currentNumber; i < cnt + amount; i++) {
                            const SMID = `SM-${profile.globalId}-${i}`
                            await browserPrint.print(profile.zpl.replace(/{SMID}/g, SMID))

                            if(i === cnt + amount -  1) {
                                setProgress(100)

                                setPrinting(false)
                                api.success({
                                    message: "Drucken erfolgreich",
                                    description: "Der Druckvorgang wurde erfolgreich beendet."
                                })

                                ipcRenderer.invoke('database').then(database => {
                                    // @ts-ignore
                                    setProfile(database.data.profiles.find(p => p.id === profile.id))
                                })
                            } else {
                                setProgress(Math.floor(((i - cnt) / amount ) * 100))
                            }
                        }
                    })
                })
            } else {
                api.warning({
                    message: "Drucken fehlgeschlagen",
                    description: "Es läuft bereits ein aktiver Druckvorgang."
                })
            }
        }} type="primary" icon={printing ? <LoadingOutlined style={{ fontSize: 24 }} spin /> : <i className="fa-duotone fa-print" style={{ color: "white", fontSize: 30 }} />} style={{ width: 80, height: 80, padding: 0, bottom: 32, right: 32 }} />}
    </Page>
}
