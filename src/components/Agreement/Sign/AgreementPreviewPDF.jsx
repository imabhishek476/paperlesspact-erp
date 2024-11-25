import React from 'react'

const AgreementPreviewPDF = ({agreementUrl}) => {
  console.log(agreementUrl);
  return (
    <iframe
        src={`${agreementUrl}#toolbar=0`}
        width={"100%"}
        height={"100%"}
        />
  )
}

export default AgreementPreviewPDF;