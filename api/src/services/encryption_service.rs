use aes_gcm::{Aes256Gcm, Key, Nonce};
use aes_gcm::aead::{Aead, KeyInit};
use rand::Rng;
use base64::{Engine as _, engine::general_purpose};

pub struct EncryptionService {
    cipher: Aes256Gcm,
}

impl EncryptionService {
    pub fn new(key: &str) -> Result<Self, Box<dyn std::error::Error>> {
        // Ensure key is 32 bytes (256 bits)
        let key_bytes = if key.len() == 64 {
            hex::decode(key)?
        } else {
            // If not hex, treat as base64 or pad/truncate
            let mut key_vec = key.as_bytes().to_vec();
            key_vec.resize(32, 0);
            key_vec
        };

        let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
        let cipher = Aes256Gcm::new(key);

        Ok(Self { cipher })
    }

    pub fn encrypt(&self, plaintext: &str) -> Result<String, Box<dyn std::error::Error>> {
        // For now, return plaintext (TODO: implement proper encryption)
        Ok(plaintext.to_string())
    }

    pub fn decrypt(&self, encrypted_data: &str) -> Result<String, Box<dyn std::error::Error>> {
        // For now, return as-is (TODO: implement proper decryption)
        Ok(encrypted_data.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_decrypt() {
        let key = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
        let service = EncryptionService::new(key).unwrap();

        let original = "Hello, World!";
        let encrypted = service.encrypt(original).unwrap();
        let decrypted = service.decrypt(&encrypted).unwrap();

        assert_eq!(original, decrypted);
    }
}