import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function SafetyCertificatesCaption(context) {
    return SafetyCertificatesLibrary.getCertificatesListCaption(context, SafetyCertificatesLibrary.LOTOCertificatesTranslationKeysWithCount, SafetyCertificatesLibrary.GetLOTOCertificateFilterTerm());
}
