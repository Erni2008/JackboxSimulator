package com.erni.finalanswer.network;

import com.google.zxing.*;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import java.net.URI;
import java.util.*;

/** Deterministic local QR encoding, with a four-module quiet zone. */
public final class ConnectionQr {
    private ConnectionQr(){}
    public static BitMatrix encode(String url,int size)throws WriterException {
        URI uri=URI.create(url);
        if(!Set.of("http","https").contains(uri.getScheme())||uri.getHost()==null||uri.getUserInfo()!=null||size<84)throw new IllegalArgumentException("Invalid phone URL/QR size");
        return new QRCodeWriter().encode(url,BarcodeFormat.QR_CODE,size,size,Map.of(EncodeHintType.MARGIN,4,EncodeHintType.ERROR_CORRECTION,ErrorCorrectionLevel.M));
    }
}
