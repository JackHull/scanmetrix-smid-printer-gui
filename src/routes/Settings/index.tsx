// eslint-disable-next-line import/no-named-as-default
import styled from "styled-components";
import Page from "../../components/Page"
import {Button, FloatButton, Input, InputNumber, Modal, notification, Table, Typography} from "antd";
import {useEffect, useState} from "react";
const { ipcRenderer } = window.require("electron");

const StyledContainer = styled.div`
  background: white;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.25);
`

export default () => {
    const [ modalOpen, setModalOpen ] = useState(false)
    const [ name, setName ] = useState(null)
    const [ globalId, setGlobalId ] = useState(null)
    const [ startNumber, setStartNumber ] = useState(1)
    const [ profiles, setProfiles ] = useState([])

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
        <Modal onCancel={() => setModalOpen(false)} title="Neues Profil anlegen" open={modalOpen} footer={() => (
            <>
                <Button onClick={() => setModalOpen(false)}>Abbrechen</Button>
                <Button disabled={!name || !globalId || startNumber === null || startNumber < 0} type="primary" onClick={() => {
                    ipcRenderer.invoke('database').then(database => {
                        database.data.profiles.push({
                            name,
                            globalId,
                            startNumber,
                            currentNumber: 0
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
        <h1 style={{ marginBottom: 16 }}>Profile konfigurieren</h1>
        <StyledContainer>
            <Table columns={[
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
            setModalOpen(true)
        }} type="primary" icon={<i className="fas fa-plus" style={{ color: "white", fontSize: 30 }} />} style={{ width: 80, height: 80, padding: 0, bottom: 32, right: 32 }} />
    </Page>
}