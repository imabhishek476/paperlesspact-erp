import Image from "next/image";
import React from "react";

const AgreementPreview = ({ agreementResponse }) => {
  // const ownerAddress = agreementResponse?.ownerDetails?.address;
  // const ownerName = agreementResponse?.ownerDetails?.fullname;
  // const tenantAddress = agreementResponse?.tenantDetails?.address;
  // const tenantName = agreementResponse?.tenantDetails?.fullname;
  const ownerName = agreementResponse?.ownerDetails &&   (Array.isArray(agreementResponse?.ownerDetails)
    ? agreementResponse?.ownerDetails[0].fullname
    : agreementResponse?.ownerDetails?.fullname)
  const ownerAddress = agreementResponse?.ownerDetails &&   (Array.isArray(agreementResponse?.ownerDetails)
  ? agreementResponse?.ownerDetails[0].address
  : agreementResponse?.ownerDetails?.address)
  const tenantName = agreementResponse?.tenantDetails &&   (Array.isArray(agreementResponse?.tenantDetails)
  ? agreementResponse?.tenantDetails[0].fullname
  : agreementResponse?.tenantDetails?.fullname)
  const tenantAddress = agreementResponse?.tenantDetails &&   (Array.isArray(agreementResponse?.tenantDetails)
  ? agreementResponse?.tenantDetails[0].address
  : agreementResponse?.tenantDetails?.address)
  const city = agreementResponse?.propertyDetails?.city?.districtName;
  let fullPropertyAddress
  if(agreementResponse?.propertyDetails){
    fullPropertyAddress = `${agreementResponse?.propertyDetails?.address}, ${agreementResponse?.propertyDetails?.city?.districtName}, ${agreementResponse?.propertyDetails?.state?.stateName}, ${agreementResponse?.propertyDetails?.pincode}`;;
  }
  const rent = agreementResponse?.agreementDetails?.rent;
  const paymentDate = agreementResponse?.agreementDetails?.paymentDate;
  const deposit = agreementResponse?.agreementDetails?.deposit;
  const billingBy = agreementResponse?.agreementDetails?.billingBy;
  const escalation = agreementResponse?.agreementDetails?.escalation;
  let itemTable = <></>;

  agreementResponse?.items?.map((item, index) => {
    itemTable = (
      <>
        {itemTable}
        <tr>
          <td
            width={91}
            valign={"top"}
            style={{
              width: "68.25pt",
              border: "solid gray 1.0pt",
              borderTop: "none",
              padding: "4.0pt",
              height: "21.0pt",
            }}
          >
            <p className="MsoNormal mt-2 text-center " align={"center"}>
              <span className="text-black">{index + 1}</span>
            </p>
          </td>
          <td
            width={219}
            valign={"top"}
            className="border-b-1 border-r-1 border-black p-1"
          >
            <p className="MsoNormal mt-2 text-center" align={"center"}>
              <span className="text-black">{item.name}</span>
            </p>
          </td>
          <td
            width={202}
            valign={"top"}
            className="border-b-1 border-r-1 border-black p-1"
          >
            <p className={"MsoNormal mt-2 text-center"} align={"center"}>
              <span className="text-black">{item.quantity}</span>
            </p>
          </td>
        </tr>
      </>
    );
  });

  let startDate = "";
  let endDate = "";
  if (agreementResponse?.agreementDetails?.startDate) {
    startDate = new Date(
      agreementResponse?.agreementDetails?.startDate
    ).toLocaleDateString();
    endDate = new Date(agreementResponse?.agreementDetails?.startDate);
    endDate.setMonth(
      endDate.getMonth() + agreementResponse?.agreementDetails?.validity
    );
    endDate = endDate.toLocaleDateString();
  }
  const startDay = new Date(
    agreementResponse?.agreementDetails?.paymentDate
  ).getDate();
  const date = new Date(agreementResponse?.createdDate);
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const fullDateInWords = `${day} of ${month} ${year}`;
  if (!agreementResponse?.user?.fullname) {
    return (
      <div
        style={{
          ...styles.wordSection1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "575px",
          flexDirection: "column",
          marginTop: "40px",
          gap: "16px",
          border: "none",
        }}
      >
        <Image
          height={350}
          width={300}
          alt={"No Case Image"}
          src={"/images/NoCaseImage.png"}
        />
        <p className="text-[20px] font-[500]">
          Enter Basic details to see Agreement Preview
        </p>
      </div>
    );
  }
  return (
    <div style={styles.wordSection1}>
      <p
        style={{
          ...styles.msoNormal,
          //   marginBottom: "",
          textAlign: "center",
          lineHeight: "119%",
        }}
      >
        <span
          style={{ fontSize: "19.5pt", lineHeight: "119%", color: "black" }}
        >
          Agreement Preview
        </span>
      </p>

      <p
        style={{
          ...styles.msoNormal,
          marginTop: "8px",
          textAlign: "center",
          lineHeight: "190%",
        }}
      >
        <u>
          <span style={{ color: "black" }}>LEASE DEED</span>
        </u>
      </p>

      <p
        style={{
          ...styles.msoNormal,
          marginTop: "29.0pt",
          marginRight: "0in",
          marginLeft: "51.0pt",
          textIndent: "-.25in",
        }}
      >
        1.
        <span style={{ font: '7.0pt "Times New Roman"' }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        Property Address:
        <span style={styles.variable}>
          {" "}
          {fullPropertyAddress ? fullPropertyAddress : "   __________"}{" "}
        </span>
      </p>
      <p
        style={{
          ...styles.msoNormal,
          marginTop: "29.0pt",
          marginRight: "0in",
          marginLeft: "51.0pt",
          textIndent: "-.25in",
        }}
      >
        2.
        <span style={{ font: '7.0pt "Times New Roman"', color: "#eabf4e" }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        Rs <span style={styles.variable}>{rent ? rent : " ___"}</span> per month
        from
        <span style={styles.variable}>
          {" "}
          {startDate ? startDate : "   __________"}{" "}
        </span>
      </p>
      <p
        style={{
          ...styles.msoNormal,
          marginTop: "29.0pt",
          marginRight: "0in",
          marginLeft: "51.0pt",
          textIndent: "-.25in",
        }}
      >
        3.
        <span style={{ font: '7.0pt "Times New Roman"' }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        Period of Lease:
        <span style={styles.variable}>
          {" "}
          {endDate && startDate
            ? `${startDate} to ${endDate}`
            : "   __________"}{" "}
        </span>
      </p>
      <p
        style={{
          ...styles.msoNormal,
          marginTop: "29.0pt",
          marginRight: "0in",
          marginLeft: "51.0pt",
          textIndent: "-.25in",
        }}
      >
        4.
        <span style={{ font: '7.0pt "Times New Roman"' }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        Security Amount:
        <span style={styles.variable}>
          {" "}
          {deposit ? deposit : "   __________"}{" "}
        </span>
      </p>
      <p
        style={{
          ...styles.msoNormal,
          marginTop: "29.0pt",
          marginRight: "0in",
          marginLeft: "51.0pt",
          textIndent: "-.25in",
        }}
      >
        5.
        <span style={{ font: '7.0pt "Times New Roman"' }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        Electricity/Water Charges: As per Meters payable as per the billing
        cycle paid by{" "}
        <span style={styles.variable}> {billingBy ? billingBy : " ___"} </span>{" "}
        before the due dates.
      </p>
      <p
        style={{
          ...styles.msoNormal,
          marginTop: "29.0pt",
          marginRight: "0in",
          marginLeft: "51.0pt",
          textIndent: "-.25in",
        }}
      >
        6.
        <span style={{ font: '7.0pt "Times New Roman"' }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        Escalation after expiry:
        <span style={styles.variable}>
          {" "}
          {escalation ? `${escalation}%` : "   __________"}{" "}
        </span>
      </p>
      <p style={{ marginTop: "29.0pt", lineHeight: "190%" }}>
        <span style={{ color: "black" }}>
          This Lease Deed/Rent Agreement is executed at
        </span>
        <span style={styles.variable}> {city ? city : " ____"} </span>
        <span style={{ color: "black" }}>on day</span>
        <span style={styles.variable}>
          {" "}
          {fullDateInWords ? fullDateInWords : "   __________"}{" "}
        </span>
      </p>
      <p
        style={{
          marginTop: "29.0pt",
          textAlign: "center",
          lineHeight: "190%",
        }}
      >
        <span style={{ color: "black" }}>Between</span>
      </p>

      <p style={{ marginTop: "29.0pt", lineHeight: "190%" }}>
        <span style={{ color: "black" }}>Mr./Mrs. </span>
        <span style={styles.variable}>
          {" "}
          {ownerName ? ownerName : "   __________"}{" "}
        </span>
        <span style={{ color: "black" }}>R/o </span>
        <span style={styles.variable}>
          {" "}
          {ownerAddress ? ownerAddress : "   __________"}{" "}
        </span>
        <span style={{ color: "black" }}>
          {" "}
          (Hereinafter called the Lessor No. 1 and/ or the First Party)
        </span>
      </p>

      <p
        style={{
          marginTop: "29.0pt",
          textAlign: "center",
          lineHeight: "190%",
          // background: "white",
        }}
      >
        <span style={{ color: "black" }}>And</span>
      </p>
      <p style={{ marginTop: "29.0pt", lineHeight: "190%" }}>
        <span style={{ color: "black" }}>1.)Mr./Mrs.</span>
        <span style={styles.variable}>
          {" "}
          {tenantName ? tenantName : "   __________"}{" "}
        </span>
        <span style={{ color: "black" }}>R/o </span>
        <span style={styles.variable}>
          {" "}
          {tenantAddress ? tenantAddress : "   __________"}{" "}
        </span>
        <span style={{ color: "black" }}>
          {" "}
          (Hereinafter called the Second Party)
        </span>
      </p>

      <p style={{ marginTop: "29.0pt", lineHeight: "190%" }}>
        <span style={{ color: "black" }}>
          Whereas the Lessor(s) are jointly the lawful owners in possession of
          the premises located at
        </span>
        <span style={styles.variable}>
          {" "}
          {fullPropertyAddress ? fullPropertyAddress : "   __________"}{" "}
        </span>
        <span style={{ color: "black" }}>
          (hereinafter called the &apos;demised premises&apos;). The expression
          Lessor(s) and Lessee shall mean and include their respective heirs,
          successors, representatives, and assignees.
        </span>
      </p>

      <p style={{ marginTop: "29.0pt", lineHeight: "190%" }}>
        <span style={{ color: "black" }}>
          Whereas on the request of the Lessee, the Lessor(s) have agreed to let
          out the said demised premises to the LESSEE, and the LESSEE has agreed
          to take it on rent w.e.f.
        </span>
        <span style={styles.variable}>
          {" "}
          {startDate ? startDate : "   __________"}{" "}
        </span>
        <span style={{ color: "black" }}>
          for its bonafide residential use. Whereas the LESSOR(S) has
          represented that the said demised premises is free from all
          encumbrances and the LESSOR(S) has a clean and unrestricted right to
          the said demised premises. Whereas the Lessor(s) and Lessee both
          represented that they are legally competent to enter into this Lease
          Agreement on the terms conditions contained herein.
        </span>
      </p>
      <p
        style={{
          marginTop: "14.0pt",
          marginRight: "0in",
          marginLeft: "51.0pt",
          marginBottom: "0in",
          textIndent: "-.25in",
        }}
      >
        1.
        <span style={{ font: '7.0pt "Times New Roman"' }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        That the second party shall pay the monthly rent of
        <span style={styles.variable}>Rs {rent ? rent : " ___"} </span> in
        respect of the demised premises located at
        <span style={styles.variable}>
          {" "}
          {fullPropertyAddress ? fullPropertyAddress : "   __________"}{" "}
        </span>
        . The rent shall be paid per month in advance through advance rental on
        or before the
        <span style={styles.variable}>
          {" "}
          {startDay ? startDay : " ___"}{" "}
        </span>{" "}
        day of each English calendar month to each of Lessor(s) / First Party in
        the proportion as agreed by the First Party amongst themselves. In case
        of TDS deduction, the Lessee shall furnish the TDS certificate to the
        Lessor(s) at the end of each calendar quarter well within time so as to
        enable the Lessor(s) to file his income tax return within the stipulated
        timeframe. Each of the parties will bear the consequences for any
        non-compliance on account of the tax liability of its part.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        2.
        <span style={{ font: '7.0pt "Times New Roman"' }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        That the second party has deposited a sum of
        <span style={styles.variable}>Rs {deposit ? deposit : " ___"} </span> as
        interest free refundable security deposit, which will be refunded
        (Interest Free) by the First Party at the time of vacating the demised
        premises after deducting any outstanding rent, electricity, water
        (unless electricity and water charges if to be borne by lessor(s)),
        sewerage and maintenance charges, bills, etc., if any, which are payable
        by the Lessee at the time of vacating the demised premises. Lessor(s)
        shall have the right to adjust all the dues including but not limited to
        rent, maintenance, electricity, water, sewerage, etc. of the notice
        period from the Refundable Security deposit except the electricity and
        water charges if to be borne by Lessor(s).
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        3.
        <span style={{ font: '7.0pt "Times New Roman"' }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        That the electricity and water charges will be paid timely regularly
        every month by the Lessee as per actual bills provided by the service
        provider. A copy of the payment receipts will be provided by the Lessee
        to the Lessor(s) on demand.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        4.
        <span style={{ font: '7.0pt "Times New Roman"' }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        That the Lessor(s) shall hand over the premises to the Lessee in a
        habitable condition.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        5.
        <span style={{ font: '7.0pt "Times New Roman"' }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        That in case any damage is caused by the LESSEE to the aforesaid
        premises, fixtures, fittings, etc.(except normal wear and tear), the
        LESSEE shall be liable to make good the same to ensure that those is
        restored in the same condition as they were at the time of signing of
        this lease other than the changes made by the LESSEE with the consent of
        the LESSOR(S). In case of LESSEE fails to do so, LESSOR(S) shall be
        entitled to deduct the costs of doing the same from the interest free
        security deposit.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        6.
        <span style={{ font: '7.0pt "Times New Roman"' }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        That after the expiry of the monthly rent shall be increased at the
        escalation of
        <span style={styles.variable}>
          {" "}
          {escalation ? `${escalation}%` : " ___"}{" "}
        </span>{" "}
        or at mutually agreed by all the parties at the time of renewal in the
        discussion as per prevailing market conditions.
      </p>
      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        7. That the Second Party shall have no right, to make any addition,
        alteration in the said demised premises except furnishings. The
        Lessor(s) shall not be liable to pay any charges against the expenses
        incurred by the Lessee for any additional furnishing at the demised
        premises.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        8. That the Second Party shall have no right to sub-let the whole or
        part of demised premises to any other person or entity at any time.
        Further, The Lessor(s) or his authorized representative has the right to
        visit the demised premises on any working day during business hours
        after taking the Lessee&apos;s permission.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        9. That the demised premises shall be used by the Lessee in a cordial
        and civilized manner without causing any nuisance or disturbance to the
        other occupants of the building complex. The Lessee shall use the
        demised premises for its bonafide legal purposes and shall not do or
        cause any actions or activities of illegal, immoral, unsocial nature in
        the said demised premises and will not create any nuisance to the
        neighborhood in any manner whatsoever.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        10. That day-to-day repair such as fuses, leakage of water taps,
        replacement of defective MCBs, Bulbs, Tube lights, Tube light Fittings,
        connecting sanitary pipes, doors, door locks, etc. shall be done by the
        Lessee at its own costs. However, major repairs such as leakage from the
        wall/ceiling, etc. would be rectified by the Lessor(s) on the request of
        Lessee.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        11. That in case the Lessee defaults in payment of rent for any month or
        commits any breach of any of the terms and conditions of this deed, the
        LESSOR(S) shall be entitled to get back the possession of the demised
        premises after providing reasonable notice to the Lessee. In such case,
        notice to the lessee shall be given by each of Lessor(s) / First Party.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        12. That the Lessee shall make sure that all the payments have been made
        on regular basis by them to the Service Providers or Government
        Authorities on account of any services utilized by them or taxes/levies
        demanded by or payable to Government Authorities on account of their
        transactions. The Lessee shall be liable at all times even after
        vacation of the said residential space for dues if any arising of the
        tenure of occupation of the Lessee which is liable to be paid by the
        Lessee.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        13. That any outstanding amount towards rental or maintenance, if not
        settled by the Lessee, will be adjusted from the security deposit of Rs{" "}
        {deposit} provided to the LESSOR(S). The notice period to be served by
        either party would be of 1 Month. Either the LESSOR(S) or the LESSEE may
        terminate this agreement without assigning any reasons whatsoever by
        giving one month&apos;s advance notice to the other party. The
        respective notices shall be sent and provided to each of the parties at
        their aforesaid addresses mentioned above.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        14. The Lessor(s) will ensure that all outstanding bills/ charges on the
        above said demised premises on account of electricity, water, and any
        other incidentals prior to the start of lease from {startDate} are
        settled and paid. Any payment on account of the above pertaining to the
        period before the start of lease w.e.f. {startDate} will be settled by
        the Lessor(s). In the unlikely instance that the connection/s for
        electricity or water is disconnected due to non-payment or negligence of
        the LESSEE, the charges to restoring such connections shall be borne
        fully by the LESSEE and if not paid the same can be deducted from the
        security deposit provided to the Lessor(s).
      </p>
      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        15.
        <span style={{ fontFamily: "Times New Roman", fontSize: "7.0pt" }}>
          &nbsp;{" "}
        </span>
        That after the expiry of this Lease Deed, if the LESSOR(S) does not wish
        to renew it or to continue further, the Lessee is bound to vacate the
        demised premises immediately upon expiry of the lease to the Lessor(s)
        in all good faith and handover the peaceful possession to the Lessor(s)
        failing which the Lessee will pay damages at the rate of double the
        monthly rent as stipulated in this Deed.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        16.
        <span style={{ fontFamily: "Times New Roman", fontSize: "7.0pt" }}>
          &nbsp;{" "}
        </span>
        That the Lessor(s)/ his authorized agents shall acknowledge and give
        valid & duly stamped receipts as and when requested by the LESSEE as
        conclusive proof of rent payments on demand from the Lessee. The
        registration charges and stamp duty expenses will be shared by all
        parties in an equal ratio.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        17.
        <span style={{ fontFamily: "Times New Roman", fontSize: "7.0pt" }}>
          &nbsp;{" "}
        </span>
        It is further agreed between the parties that in case of any dispute the{" "}
        <span style={styles.variable}> {city ? city : " ___"} </span> court
        shall have the exclusive jurisdiction over the disputes.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        18.
        <span style={{ fontFamily: "Times New Roman", fontSize: "7.0pt" }}>
          &nbsp;{" "}
        </span>
        This Deed shall be governed by and interpreted in accordance with the
        laws of India. All disputes, differences, disagreements, controversies
        or claims arising out of or in connection with this Deed, including the
        validity, effect, and interpretation thereof, shall, at the request of
        either party, be referred to the sole arbitrator mutually appointed by
        all the parties, who shall conduct the arbitration proceedings in
        English and in accordance with the provisions of the Arbitration and
        Conciliation Act, 1996, or any amendment or statutory modification or
        replacement/substitution thereof. Any award made by the arbitrator shall
        be final and binding on the Parties. The cost and expenses of the
        arbitration proceedings, including fees of the arbitrators, shall be
        borne equally by the Parties. The venue of arbitration shall be as
        mutually decided by the parties.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        19.
        <span style={{ fontFamily: "Times New Roman", fontSize: "7.0pt" }}>
          &nbsp;{" "}
        </span>
        Without any prejudice to a Party’s other rights and claims under this
        Lease or otherwise, if one party breaches any of its representations,
        obligations, warranties, covenants or undertakings or violates any
        provision hereunder, it shall indemnify and keep the other Party and/or
        service providers harmless against all direct damages and costs suffered
        or borne by it/them thereby including but not limited to costs incurred
        in defending all claims/actions, or proceedings that may arise or may be
        otherwise necessary to ensure exclusive, quiet and peaceful access,
        occupation and use of the Leased Premises in accordance with this Deed.
        Without prejudice to other rights enjoyed by either Party
        (non-defaulting Party) under the Deed and Applicable Laws, the other
        Party (Defaulting Party) shall be responsible for and will indemnify
        against all claims, demands, suits, proceedings, judgments, direct
        damage, and relevant costs that the non-defaulting Party may suffer or
        incur in connection with loss of life and/or personal injury to the
        occupants of the Leased Premises and/or damage to the Building if the
        same arise from any wrongful/negligent act or omission of the defaulting
        Party.
      </p>
      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        20.
        <span style={{ fontFamily: "Times New Roman", fontSize: "7.0pt" }}>
          &nbsp;{" "}
        </span>
        Force Majeure: If the whole or any part of the said Premises shall at
        any time during the term of the lease be destroyed or damaged due to any
        force majeure circumstances including storm, tempest, flood, Act of God,
        an act of terrorism, war or any other irresistible force or the Lessee
        is deprived of the use of the said Premises for reasons not attributable
        to the Lessee, the Lessor(s) hereby undertakes to restore the said
        Premises as expeditiously as possible or, as the case may be, to remove
        the impediment in its use and occupation as expeditiously as possible.
        Notwithstanding the foregoing, upon the happening of any such event as
        aforesaid, the Lessee shall not be liable to pay Lease Rent during the
        period the Lessee is deprived of the use of the said Premises or any
        part thereof. The Lessee shall also have the option to terminate the
        Lease after the event by giving one month’s notice and without payment
        of any rent in lieu thereof and without incurring any liability to pay
        any other amount whatsoever to the Lessor(s).
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        21.
        <span style={{ fontFamily: "Times New Roman", fontSize: "7.0pt" }}>
          &nbsp;{" "}
        </span>
        Notice: Any notice or communication to be addressed by one party to the
        other shall be in writing and shall be served at the addresses as given
        hereinabove by registered post with A/D or at such other addresses as
        may be notified in writing by one party to another. Any change in such
        address shall be promptly notified to the other party in writing.
      </p>

      <p style={{ marginLeft: "51.0pt", textIndent: "-.25in" }}>
        22.
        <span style={{ fontFamily: "Times New Roman", fontSize: "7.0pt" }}>
          &nbsp;{" "}
        </span>
        Miscellaneous:
      </p>

      <p style={{ marginLeft: "102.0pt", textIndent: "-.25in" }}>
        1.
        <span style={{ fontFamily: "Times New Roman", fontSize: "7.0pt" }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        This Lease Agreement constitutes the entire agreement concerning the
        subject matter hereof between the Lessor(s) and the Lessee and
        supersedes any prior representations or agreements, whether written or
        oral between the Lessor(s) and Lessee. No modification or amendment of
        this Agreement or waiver of any of its provisions shall be binding upon
        the parties hereto unless made in writing and duly signed by all the
        Parties.
      </p>

      <p style={{ marginLeft: "102.0pt", textIndent: "-.25in" }}>
        2.
        <span style={{ fontFamily: "Times New Roman", fontSize: "7.0pt" }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        If any provision of this Agreement is held to be unenforceable, the
        remaining provisions of this Agreement shall continue to remain in full
        force and effect.
      </p>

      <p style={{ marginLeft: "102.0pt", textIndent: "-.25in" }}>
        3.
        <span style={{ fontFamily: "Times New Roman", fontSize: "7.0pt" }}>
          &nbsp;&nbsp;&nbsp;{" "}
        </span>
        Leegality.com is the e-witness to this rental agreement.
      </p>
      <p style={{ marginTop: "29.0pt", lineHeight: "190%", color: "black" }}>
        Signature of the Lessor(s) / First Party
      </p>

      <p style={{ marginTop: "29.0pt", lineHeight: "190%", color: "black" }}>
        Signature of the Lessee / Second Party
      </p>

      <p style={{ marginTop: "15.0pt", color: "black" }}>Annexure 1</p>

      <p style={{ color: "black" }}>
        Items provided by the LESSOR(S) at the time of execution of Lease Deed
        between the LESSOR(S) and the LESSEE are as follows:
      </p>
      <table
        className="1"
        style={{ borderCollapse: "collapse", border: "none", width: "100%" }}
      >
        <tbody>
          <tr style={{ height: "21.0pt" }}>
            <td
              style={{
                width: "68.25pt",
                border: "solid gray 1.0pt",
                padding: "4.0pt",
                height: "21.0pt",
              }}
              width="91"
              valign="top"
            >
              <p
                style={{
                  marginTop: "11.0pt",
                  textAlign: "center",
                }}
              >
                Sr No.
              </p>
            </td>
            <td
              style={{
                width: "164.25pt",
                border: "solid gray 1.0pt",
                borderLeft: "none",
                padding: "4.0pt",
                height: "21.0pt",
              }}
              width="219"
              valign="top"
            >
              <p
                style={{
                  marginTop: "11.0pt",
                  textAlign: "center",
                }}
              >
                <span style={{ color: "black" }}>Item</span>
              </p>
            </td>
            <td
              style={{
                width: "151.5pt",
                border: "solid gray 1.0pt",
                borderLeft: "none",
                padding: "4.0pt",
                height: "21.0pt",
              }}
              width="202"
              valign="top"
            >
              <p
                style={{
                  marginTop: "11.0pt",
                  textAlign: "center",
                }}
              >
                <span style={{ color: "black" }}>Number of Units</span>
              </p>
            </td>
          </tr>
          {itemTable}
        </tbody>
      </table>

      <p>&nbsp;</p>
    </div>
  );
};

export default AgreementPreview;

const styles = {
  msoNormal: {
    margin: "0in",
    lineHeight: "115%",
    fontSize: "11.0pt",
    fontFamily: '"Arial", sans-serif',
  },
  msoChpDefault: {
    fontFamily: '"Arial", sans-serif',
  },
  msoPapDefault: {
    lineHeight: "115%",
  },
  wordSection1: {
    size: "595.45pt 841.7pt",
    margin: 0,
    borderRadius: "8px",
    padding: "16px",
    marginLeft: "16px",
    border: "1px solid #b2aa9485",
    maxHeight: "90vh",
    overflow: "auto",
  },
  divWordSection1: {
    page: "WordSection1",
  },
  ol: {
    marginBottom: "0in",
  },
  ul: {
    marginBottom: "0in",
  },
  variable: {
    color: "#fda178",
    backgroundColor: "#f2f3f8",
    fontSize: "16px",
    fontWeight: 600,
  },
};
