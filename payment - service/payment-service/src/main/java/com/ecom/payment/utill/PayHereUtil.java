package com.ecom.payment.utill;

import java.math.BigInteger;
import java.security.MessageDigest;

public class PayHereUtil {

    public static String generateHash(String merchantId, String orderId, String amount, String currency, String secret) {

        try {
            String hashedSecret = md5(secret).toUpperCase();
            String raw = merchantId + orderId + amount + currency + hashedSecret;

            return md5(raw).toUpperCase();

        } catch (Exception e) {
            throw new RuntimeException("Hash error");
        }
    }

    private static String md5(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(input.getBytes());

        BigInteger number = new BigInteger(1, digest);
        String hash = number.toString(16);

        while (hash.length() < 32) {
            hash = "0" + hash;
        }

        return hash;
    }
}
