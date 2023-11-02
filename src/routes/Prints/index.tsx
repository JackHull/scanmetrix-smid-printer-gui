// eslint-disable-next-line import/no-named-as-default
import styled from "styled-components";
import Page from "../../components/Page"
import { Table } from "antd";
import { useEffect, useState } from "react";
const { ipcRenderer } = window.require("electron");
import moment from "moment"

const StyledContainer = styled.div`
  background: white;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.25);
`

export default () => {
    const [ profiles, setProfiles ] = useState([])
    const [ prints, setPrints ] = useState([])

    const fetch = () => {
        ipcRenderer.invoke('database').then(database => {
            setPrints(database.data.prints)
            setProfiles(database.data.profiles)
        })
    }

    useEffect(() => {
        fetch()
    }, [])

    return <Page>
        <h1 style={{ marginBottom: 4 }}>Druckhistorie</h1>
        <h2 style={{ marginBottom: 32, fontWeight: 400, fontSize: 18 }}>Bereits gedruckte SMIDs ansehen.</h2>
        <StyledContainer>
            <Table
                columns={[
                    {
                        title: "Profil",
                        dataIndex: "profile",
                        key: "profile"
                    },
                    {
                        title: "Drucker",
                        dataIndex: "printer",
                        key: "printer"
                    },
                    {
                        title: "Datum",
                        dataIndex: "date",
                        key: "date"
                    },
                    {
                        title: "Startwert",
                        dataIndex: "startNumber",
                        key: "startNumber"
                    },
                    {
                        title: "Stückzahl",
                        dataIndex: "amount",
                        key: "amount"
                    },
                    {
                        title: "Endwert",
                        dataIndex: "endNumber",
                        key: "endNumber"
                    }
                ]} dataSource={prints.map(print => ({ ...print, profile: profiles.find(p => p.id === print.profile)?.name || print.profile  })).sort((a, b) => moment(b.date, "DD.MM.YYYY HH:mm").valueOf() - moment(a.date, "DD.MM.YYYY HH:mm").valueOf())} />
        </StyledContainer>
    </Page>
}
