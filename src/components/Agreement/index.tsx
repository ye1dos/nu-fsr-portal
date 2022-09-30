import React from 'react';
import { Trans } from "react-i18next";
class Agreement extends React.Component<any, any> {
    render() {
        return (
            <>
                <p style={{paddingTop: '40px'}}><Trans>agreement</Trans></p>
                <p style={{paddingTop: '20px'}}><Trans>agreement2</Trans></p>
            </>
        )
    }

}
export default Agreement;