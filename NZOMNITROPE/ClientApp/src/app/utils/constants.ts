export const CONTACT_VALUES = {
    PROGRAM_PHONE: '0800 666 487',
    MEDICAL_ENQUIRY_EMAIL: 'mi.new_zealand@sandoz.com',
    MEDICAL_ENQUIRY_PHONE: '0800 726 369',
    PRODUCT_COMPLAINT_EMAIL: 'sdz.technicalcomplaint@sandoz.com',
    SUPPORT_EMAIL: '',
    SUPPORT_PHONE:'1800 271 014',
    CMI_LINK: 'https://www.medsafe.govt.nz/Consumers/CMI/o/omnitrope.pdf',
    TERMS_OF_USE: 'https://www.sandoz.com.au/terms-use-and-conditions/',
    PRIVACY_POLICY: 'https://www.sandoz.com.au/Website-privacy-policy/',
    surePal5mgGuide: './assets/pdfs/Omnitrope5.pdf',
    surePal10mgGuide: './assets/pdfs/Omnitrope10.pdf',
    surePal15mgGuide: './assets/pdfs/Omnitrope15.pdf',
}

export const UI_DEFAULTS = {
    TEXT_INPUT_LIMIT : 50,
    ADDRESS_INPUT_LIMIT: 150,
}

export const DATE_FORMAT = {
    parse: {dateInput: {month: 'numeric', year: 'numeric', day: 'numeric'}},
    display: {
        dateInput: 'input',
        monthYearLabel: {year: 'numeric', month: 'short'},
        dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
        monthYearA11yLabel: {year: 'numeric', month: 'long'}
    }
  }

export const EMPTY_ADDRESS = {
    streetAddress: '',
    city: '',
    postcode: '',
    addressState: null,
    addressType: null,
}

export const BUSINESS_RULES = {
    LEGAL_AGE: 1,
}


