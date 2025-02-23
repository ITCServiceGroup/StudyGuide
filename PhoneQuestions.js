// PhoneQuestions.js

// Assign the questionBank to the global window object
window.questionBank = [
  {
    question: "What is the correct process for porting a phone number to GFiber Phone?",
    type: "multiple_choice",
    options: [
      "The customer cancels their existing service first, then initiates porting.",
      "The customer initiates porting after their GFiber installation appointment is scheduled.",
      "The customer requests a temporary number before scheduling installation.",
      "The customer must call their existing carrier and have them complete the transfer."
    ],
    correctAnswerIndex: 1,
    explanation: "Customers cannot complete the Phone Activation Flow and initiate a phone number port until they have scheduled their installation. Canceling service before porting can result in losing their number."
  },
  {
    question: "If a customer's port-in order status in Salesforce is \"EXCEPTION,\" what does it mean?",
    type: "multiple_choice",
    options: [
      "The port-in order has been successfully processed.",
      "The port-in order has invalid or missing data.",
      "The port-in order is still pending and waiting for customer confirmation.",
      "The port-in order has been completed."
    ],
    correctAnswerIndex: 1,
    explanation: "The \"EXCEPTION\" status in Salesforce indicates that some required details for the port request are either incorrect or missing and need to be corrected."
  },
  {
    question: "How long does it typically take for a phone number port to complete?",
    type: "multiple_choice",
    options: [
      "1-2 business days",
      "3-5 business days",
      "7-10 business days",
      "24 hours"
    ],
    correctAnswerIndex: 1,
    explanation: "The porting process typically takes 3-5 business days, depending on verification by the customer's original carrier."
  },
  {
    question: "Which of the following carriers require a special transfer PIN for porting out a number?",
    type: "multiple_choice",
    options: [
      "AT&T and Verizon",
      "T-Mobile and Sprint",
      "Comcast and Cox",
      "Spectrum and Frontier"
    ],
    correctAnswerIndex: 0,
    explanation: "AT&T and Verizon require a transfer PIN (not an account PIN) that must be set up before porting, as it is time-sensitive and only valid for 7 days."
  },
  {
    question: "Which of the following statements about GFiber Phone's compatibility is true?",
    type: "multiple_choice",
    options: [
      "GFiber Phone can work with up to 10 corded phones.",
      "GFiber Phone supports rotary dial phones.",
      "GFiber Phone supports up to 5 corded phones.",
      "GFiber Phone can be installed on multiple physical lines."
    ],
    correctAnswerIndex: 2,
    explanation: "GFiber Phone supports most modern handsets, but not rotary dial phones, and it can handle up to 5 corded phones on a single line."
  },
  {
    question: "Customers can have more than one GFiber Phone box per account.",
    type: "true_false",
    options: [
      "True",
      "False"
    ],
    correctAnswerIndex: 1,
    explanation: "Each account is limited to one physical GFiber Phone box, regardless of the number of telephone numbers or users."
  },
  {
    question: "Customers can schedule their GFiber Phone number port for a weekend.",
    type: "true_false",
    options: [
      "True",
      "False"
    ],
    correctAnswerIndex: 1,
    explanation: "Ports cannot be completed on weekends or holidays; they will process on the next business day."
  },
  {
    question: "If a customer cancels their service with their old provider before the port completes, they could lose their phone number.",
    type: "true_false",
    options: [
      "True",
      "False"
    ],
    correctAnswerIndex: 0,
    explanation: "The phone number must remain active with the original carrier until the porting process is fully completed."
  },
  {
    question: "What should be checked first if a customer is experiencing issues with their Fiber Phone self-installation?",
    type: "multiple_choice",
    options: [
      "Ensure the customer has a compatible phone handset.",
      "Verify that the serial number on the Phone Box matches what is listed in CSA.",
      "Check if the customer has power cycled their modem.",
      "Verify the customer's internet speed."
    ],
    correctAnswerIndex: 1,
    explanation: "If the serial number does not match, it must be corrected in CSA before troubleshooting can continue."
  },
  {
    question: "What are some potential causes of call disconnections on GFiber Phone?",
    type: "check_all_that_apply",
    options: [
      "Reconfiguring internet settings",
      "Power cycling the network",
      "The customer is using a non-compatible handset",
      "Moving to a location with poor reception (e.g., basement)"
    ],
    correctAnswerIndices: [0, 1, 3],
    explanation: "GFiber Phone, being a VoIP service, can experience disconnections due to network reconfiguration, power cycling, or weak signals in areas with poor connectivity."
  },
  {
    question: "Which of the following are valid troubleshooting steps if GFiber Phone is not working at all?",
    type: "check_all_that_apply",
    options: [
      "Verify that the account isn't impacted by a system-wide issue.",
      "Check that the GFiber account is active and has the right devices provisioned.",
      "Replace the customer's phone handset with a new one.",
      "Ensure the customer's software version is at least 3.1.2.6553GF or higher."
    ],
    correctAnswerIndices: [0, 1, 3],
    explanation: "Verifying account status, checking provisioning, and ensuring the software is up to date are valid troubleshooting steps. Replacing the handset is unnecessary unless there is a confirmed hardware issue."
  },
  {
    question: "What should a technician do if a customer's phone number is missing from their account?",
    type: "check_all_that_apply",
    options: [
      "Create an S0 OOS ticket.",
      "Escalate the issue to GFSD.",
      "Advise the customer to wait 24 hours and try again.",
      "Inform the customer that test calls may be performed."
    ],
    correctAnswerIndices: [0, 1, 3],
    explanation: "If a phone number is missing, the technician must escalate the issue, create a ticket, and inform the customer about potential test calls to confirm the issue is resolved."
  },
  {
    question: "In which situations would a port cancellation process be required?",
    type: "check_all_that_apply",
    options: [
      "The installation technician failed the internet installation.",
      "The customer requested to cancel before the port was completed.",
      "The customer changed their mind after the port was completed.",
      "The port order was scheduled on a weekend or holiday."
    ],
    correctAnswerIndices: [0, 1, 3],
    explanation: "A port cancellation is needed if installation fails or if the customer cancels before the port completes. Once a port is completed, it cannot be reversed."
  },
  {
    question: "What steps should be taken if the port order activation date has passed, but the phone number is not activated?",
    type: "check_all_that_apply",
    options: [
      "Click \"Activate\" in the Port Order section.",
      "Escalate the issue to GFSD with the port order details.",
      "Have the customer call their previous carrier.",
      "Inform the customer that resolution typically takes 1-2 business days."
    ],
    correctAnswerIndices: [0, 1, 3],
    explanation: "Attempt manual activation in the system. If that fails, escalate to GFSD with the port order details. Let the customer know a resolution usually takes 1-2 business days."
  },
  {
    question: "If a GFiber Phone customer loses service, what is the most likely cause?",
    type: "multiple_choice",
    options: [
      "Their phone number was deleted from Google's system.",
      "Their internet connection is down.",
      "They need a new SIM card.",
      "Their router is outdated."
    ],
    correctAnswerIndex: 1,
    explanation: "Because GFiber Phone uses VoIP, an active internet connection is required for the phone to work."
  },
  {
    question: "What happens to a customer's temporary number once their phone number port completes?",
    type: "multiple_choice",
    options: [
      "The customer keeps both numbers.",
      "The temporary number is automatically replaced with the transferred number.",
      "The customer must manually update the number in their account.",
      "The temporary number remains active for 30 days."
    ],
    correctAnswerIndex: 1,
    explanation: "Once the port finalizes, the temporary number is deactivated, and the newly ported number becomes the primary phone number."
  },
  {
    question: "How does GFiber Phone provide security for calls?",
    type: "multiple_choice",
    options: [
      "Calls are encrypted using Google Voice technology.",
      "Calls are routed through a dedicated VPN.",
      "Calls require two-factor authentication.",
      "Calls use blockchain verification."
    ],
    correctAnswerIndex: 0,
    explanation: "GFiber Phone's security is based on Google Voice encryption, providing similar security to other major phone providers."
  },
  {
    question: "What is the maximum call duration before a GFiber Phone call automatically disconnects?",
    type: "multiple_choice",
    options: [
      "1 hour",
      "2 hours",
      "3 hours",
      "5 hours"
    ],
    correctAnswerIndex: 2,
    explanation: "Due to Google Voice restrictions, calls made with GFiber Phone have a 3-hour limit, after which the call automatically disconnects."
  },
  {
    question: "If a customer has a problem with their Outbound Caller ID, they can update it in their account settings.",
    type: "true_false",
    options: [
      "True",
      "False"
    ],
    correctAnswerIndex: 1,
    explanation: "Outbound Caller ID changes are currently not supported for GFiber Phone. Google Fiber is investigating this issue."
  },
  {
    question: "GFiber Phone customers must use a Google Voice number.",
    type: "true_false",
    options: [
      "True",
      "False"
    ],
    correctAnswerIndex: 1,
    explanation: "Customers can use an existing Google Voice number, choose a new GFiber Phone number, or port an existing number from another carrier."
  },
  {
    question: "GFiber Phone for SMB does not allow secondary users.",
    type: "true_false",
    options: [
      "True",
      "False"
    ],
    correctAnswerIndex: 0,
    explanation: "While residential accounts may have secondary users, SMB accounts cannot add secondary users to GFiber Phone."
  },
  {
    question: "If a customer is unable to make or receive calls, what should be verified?",
    type: "check_all_that_apply",
    options: [
      "The customer's account is active.",
      "The Phone Box is properly connected.",
      "The customer is using a phone model approved by Google.",
      "The software version is at least 3.1.2.6553GF or higher."
    ],
    correctAnswerIndices: [0, 1, 3],
    explanation: "The account must be active, the hardware properly connected, and the software updated. GFiber Phone generally supports most modern handsets, so a \"Google-approved\" phone model is not typically a requirement."
  },
  {
    question: "Which of the following scenarios require escalating a ticket to GFSD?",
    type: "check_all_that_apply",
    options: [
      "A customer's port order activation date has passed but hasn't been completed.",
      "A customer wants to cancel their GFiber Phone plan.",
      "A customer's phone number is missing from their account.",
      "A customer is experiencing general call quality issues."
    ],
    correctAnswerIndices: [0, 2],
    explanation: "When a port order is overdue or a phone number is missing entirely, these issues need escalation to GFSD. Routine cancellations and general troubleshooting can typically be handled by regular support channels."
  },
  {
    question: "What are valid reasons to cancel a pending port order?",
    type: "check_all_that_apply",
    options: [
      "The customer no longer wants to transfer their phone number.",
      "The technician failed the internet installation.",
      "The customer has an old phone model that isn't compatible.",
      "The port order was scheduled on a holiday or weekend."
    ],
    correctAnswerIndices: [0, 1, 3],
    explanation: "Customers may cancel before the port is completed if they no longer want to port or if the internet installation fails. Ports set for weekends or holidays will be moved to the next business day, often requiring a schedule change or cancellation if the install fails."
  },
  {
    question: "What should be done if a customer reports poor call quality on GFiber Phone?",
    type: "check_all_that_apply",
    options: [
      "Check the customer's internet connection.",
      "Verify that the Phone Box is properly installed.",
      "Instruct them to reboot their internet equipment.",
      "Inform them that call quality cannot be adjusted."
    ],
    correctAnswerIndices: [0, 1, 2],
    explanation: "Most call quality issues are related to the stability or configuration of the internet connection or the setup of the Phone Box. Rebooting or reconfiguring the network can help improve voice quality."
  },
  {
    question: "Which of the following is true about GFiber Phone's market availability?",
    type: "check_all_that_apply",
    options: [
      "It is available to all new and existing residential customers in active Fiber markets.",
      "It is available to existing SMB customers in all markets except California.",
      "It is only available to customers with a Nest Wifi Pro router.",
      "It is automatically included with all Google Fiber internet plans."
    ],
    correctAnswerIndices: [0, 1],
    explanation: "GFiber Phone is available as an add-on for residential accounts in active Google Fiber markets and for existing SMB accounts in most markets (excluding CA). It is not limited to specific routers, nor is it automatically included in all plans."
  }
];
