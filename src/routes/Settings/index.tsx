// eslint-disable-next-line import/no-named-as-default
import styled from "styled-components";
import Page from "../../components/Page"
import {Button, FloatButton, Input, InputNumber, Modal, notification, Popover, Table, Typography} from "antd";
import {useEffect, useState} from "react";
import { v4 as uuid } from "uuid"
import TextArea from "antd/lib/input/TextArea";
const { ipcRenderer } = window.require("electron");

const StyledContainer = styled.div`
  background: white;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.25);
`

export default () => {
    const [ modalOpen, setModalOpen ] = useState(false)
    const [ editModalOpen, setEditModalOpen ] = useState(false)
    const [ popoverOpen, setPopoverOpen ] = useState(false)
    const [ name, setName ] = useState(null)
    const [ zpl, setZPL ] = useState(null)
    const [ globalId, setGlobalId ] = useState(null)
    const [ startNumber, setStartNumber ] = useState(1)
    const [ currentNumber, setCurrentNumber ] = useState(null)
    const [ profiles, setProfiles ] = useState([])
    const [ id, setId ] = useState(null)

    const [ api, contextHolder ] = notification.useNotification({
        stack: {threshold: 3}
    });

    const fetch = () => {
        ipcRenderer.invoke('database').then(database => {
            console.log(database)
            setProfiles(database.data.profiles)
        })
    }

    useEffect(() => {
        fetch()
    }, [])

    return <Page>
        {contextHolder}
        <Modal onCancel={() => {
            setPopoverOpen(false)

            setTimeout(() => setEditModalOpen(false), 100)
        }} title="Profil bearbeiten" open={editModalOpen} footer={() => (
            <>
                <Button onClick={() => {
                    setPopoverOpen(false)

                    setTimeout(() => setEditModalOpen(false), 100)
                }}>Abbrechen</Button>
                <Popover content={<>
                    <p style={{ marginBottom: 16 }}>Bist du sicher, dass du dieses Profil löschen willst?</p>
                    <Button danger type="primary" onClick={() => {
                        setPopoverOpen(false)

                        setTimeout(() => setEditModalOpen(false), 100)

                        ipcRenderer.invoke('database').then(database => {
                            database.data.profiles = database.data.profiles.filter(profile => profile.id !== id)

                            ipcRenderer.invoke('save-database', database.data).then(() => {
                                fetch()

                                setEditModalOpen(false)

                                api.success({
                                    message: "Profil erfolgreich gelöscht",
                                    description: "Das Profil wurde erfolgreich gelöscht und kann nun nicht mehr zum Drucken verwendet werden."
                                })
                            })
                        })
                    }}>Profil löschen</Button>
                </>} title="Löschen bestätigen" open={popoverOpen}>
                    <Button danger onClick={() => setPopoverOpen(true)}>Profil löschen</Button>
                </Popover>
                <Button disabled={!name || !globalId || startNumber === null || startNumber < 0} type="primary" onClick={() => {
                    ipcRenderer.invoke('database').then(database => {
                        database.data.profiles = database.data.profiles.map(profile => {
                            if(profile.id !== id) return profile

                            return Object.assign(profile, { name, globalId, zpl })
                        })

                        ipcRenderer.invoke('save-database', database.data).then(() => {
                            fetch()

                            setEditModalOpen(false)

                            api.success({
                                message: "Profil erfolgreich angepasst",
                                description: "Das Profil wurde erfolgreich angepasst und kann weiterhin zum Drucken verwendet werden."
                            })
                        })
                    })
                }}>Profil speichern</Button>
            </>
        )}>
            <div style={{ display: "grid", gridAutoFlow: "row", gridGap: 16 }}>
                <div>
                    <Typography.Title level={5}>Profilname</Typography.Title>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="bspw. Standarddruckprofil" addonBefore={<i className="fa-duotone fa-tag" />} style={{ width: "100%" }} size="large" />
                </div>
                <div>
                    <Typography.Title level={5}>Globale ID</Typography.Title>
                    <InputNumber value={globalId} onChange={setGlobalId} placeholder="bspw. 123" addonBefore={<i className="fa-duotone fa-globe" />} style={{ width: "100%" }} size="large" />
                </div>
                <div>
                    <Typography.Title level={5}>Startwert</Typography.Title>
                    <InputNumber disabled value={startNumber} placeholder="bspw. 1" addonBefore={<i className="fa-duotone fa-tally" />} style={{ width: "100%" }} size="large" />
                </div>
                <div>
                    <Typography.Title level={5}>Aktueller Wert</Typography.Title>
                    <InputNumber disabled value={currentNumber} placeholder="bspw. 1" addonBefore={<i className="fa-duotone fa-tally" />} style={{ width: "100%" }} size="large" />
                </div>
                <div>
                    <Typography.Title level={5}>ZPL Vorlage</Typography.Title>
                    <TextArea value={zpl} onChange={e => setZPL(e.target.value)} style={{ width: "100%", height: 200 }} size="large" />
                </div>
            </div>
        </Modal>
        <Modal onCancel={() => setModalOpen(false)} title="Neues Profil anlegen" open={modalOpen} footer={() => (
            <>
                <Button onClick={() => setModalOpen(false)}>Abbrechen</Button>
                <Button disabled={!name || !globalId || startNumber === null || startNumber < 0} type="primary" onClick={() => {
                    ipcRenderer.invoke('database').then(database => {
                        database.data.profiles.push({
                            id: uuid(),
                            name,
                            globalId,
                            startNumber,
                            currentNumber: startNumber,
                            zpl: `^XA
^FT50,396,0
^BQN,2,10,H,7
^FDMM,Ascanmetrix.app/qr/{SMID}^FS
^FO360,50,0^GFA,1770,1770,6,O04,001L0C,001CJ03C,001EJ0FC,001F8001FC,001FC007FC,001FF00FF,I07F83FE,I01FEFF8,J0IFE,J03FFC,J01FF,J03FF8,J07FFC,I01JF,I03FC7F8,I0FF81FE,001FE00FF8,001FC003FC,001FI01FC,001EJ07C,0018J01C,O0C,,:::2,781LFC,F81LFC,:781LFC,2,,:::001E,001F,::::I0F,I0F8,I078,I07C,I03F,001LFC,::::,:::001E,:::::1NFC,:::001E,:::::,::K03C,J03FE,J0FFE,I01FFE06,I03FFE0F,I07FBE0F,I0FE3E1F8,I0F83E0F8,001F83E0FC,001F03E07C,:::::001F03E0FC,I0F83E0F8,I0FC3E1F8,I07E3E3F,I07FBEFE,I03JFE,I01JFC,J07IF8,J03FFE,K07F,,:::J0KFC,I03KFC,I07KFC,I0LFC,I0FE,001F8,001F,::001E,001F,:I0F,I0F8,I07C,I07E,I03F8,I01KFC,:I07KFC,I0LFC,:001FC,001F8,001F,:001E,001F,:I0F,I0F8,I078,I07C,I03F,001LF8,001LFC,:::,:::J0KFC,I03KFC,I07KFC,I0LFC,001FE,001F8,001F,::001E,001F,:I0F,I0F8,I07C,I03E,I03F8,001LFC,::::,::001LFC,::::I03FC1FE,I07F007E,I07C001F,I0F8001F8,001F8I0F8,001FJ07C,:::::001F8I0FC,I0F8I0F8,I0FC001F8,I07E007F,I03F80FF,I03JFE,I01JFC,J07IF,J03FFE,K07F,,:N06,I04J0F,I0FI01F,I0F8001F8,001F8I0F8,001FJ0FC,001FJ07C,::::001FJ0F8,001F8I0F8,I0FC001F8,I0FE003F,I07F80FF,I03JFE,I01JFC,J0JF8,J03FFE,K0FF8,,::M0FC,L03FE,I0C007FF,I0F00IF8,001F01IFC,001F01F87C,001E03F07C,001E07E03C,001E0FC03C,001F1F807C,001F3F807C,001IF0078,I0FFE00F8,I07FC01F8,I03F801F,J0CI0F,N06,,:::::::::01FFC001FFC,0IFE003IF8:1IFE003IFC1EN03C:::1E01KFC3C:::1EN03C:::L03FFC,::L01FFC,,:::J01JFC,:::1EN03C::1E1LFC3C:::1EN03C:::1IFE003IFC:0IFE003IF807FFE003IF,^FS
^FO450,0,0^A0B,45^FB396,1,0,C^FH\^FD{SMID}^FS
^FO530,0,0^A0B,36^FB396,1,0,C^FH\^FD{subtitle}^FS
^XZ`
                        })

                        ipcRenderer.invoke('save-database', database.data).then(() => {
                            fetch()

                            setModalOpen(false)

                            api.success({
                                message: "Profil erfolgreich angelegt",
                                description: "Das Profil wurde erfolgreich gespeichert und kann nun zum Drucken verwendet werden."
                            })
                        })
                    })
                }}>Profil anlegen</Button>
            </>
        )}>
            <div style={{ display: "grid", gridAutoFlow: "row", gridGap: 16 }}>
                <div>
                    <Typography.Title level={5}>Profilname</Typography.Title>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="bspw. Standarddruckprofil" addonBefore={<i className="fa-duotone fa-tag" />} style={{ width: "100%" }} size="large" />
                </div>
                <div>
                    <Typography.Title level={5}>Globale ID</Typography.Title>
                    <InputNumber value={globalId} onChange={setGlobalId} placeholder="bspw. 123" addonBefore={<i className="fa-duotone fa-globe" />} style={{ width: "100%" }} size="large" />
                </div>
                <div>
                    <Typography.Title level={5}>Startwert</Typography.Title>
                    <InputNumber value={startNumber} onChange={setStartNumber} placeholder="bspw. 1" addonBefore={<i className="fa-duotone fa-tally" />} style={{ width: "100%" }} size="large" />
                </div>
            </div>
        </Modal>
        <h1 style={{ marginBottom: 4 }}>Druckprofile konfigurieren</h1>
        <h2 style={{ marginBottom: 32, fontWeight: 400, fontSize: 18 }}>Erstelle Druckprofile mit vorgegebenen Daten, um diese für den Druck zu verwenden.</h2>
        <StyledContainer>
            <Table
                onRow={(record, rowIndex) => {
                    return {
                        onClick: () => {
                            setId(record.id)
                            setZPL(record.zpl)
                            setName(record.name)
                            setGlobalId(record.globalId)
                            setStartNumber(record.startNumber)
                            setCurrentNumber(record.currentNumber)
                            setEditModalOpen(true)
                        }
                    }
                }}
                columns={[
                {
                    title: "Profilname",
                    dataIndex: "name",
                    key: "name"
                },
                {
                    title: "Globale ID",
                    dataIndex: "globalId",
                    key: "globalId"
                },
                {
                    title: "Startwert",
                    dataIndex: "startNumber",
                    key: "startNumber"
                },
                {
                    title: "Aktueller Wert",
                    dataIndex: "currentNumber",
                    key: "currentNumber"
                }
            ]} dataSource={profiles} />
        </StyledContainer>
        <FloatButton onClick={() => {
            setName(null)
            setGlobalId(null)
            setStartNumber(null)
            setId(null)
            setModalOpen(true)
        }} type="primary" icon={<i className="fas fa-plus" style={{ color: "white", fontSize: 30 }} />} style={{ width: 80, height: 80, padding: 0, bottom: 32, right: 32 }} />
    </Page>
}
