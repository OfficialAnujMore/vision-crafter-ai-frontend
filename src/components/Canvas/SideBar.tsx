import React, { useContext } from 'react'
import { PanelContext } from '../../context/panelContext'

const SideBar = () => {
    const panelProvider = useContext(PanelContext)
    return (
        <div>
            <p>

                {"Active " }{panelProvider?.activeTool}
            </p>
        </div>
    )
}

export default SideBar