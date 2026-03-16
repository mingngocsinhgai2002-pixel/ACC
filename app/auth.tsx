import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { signUp, signIn } from '@/lib/auth';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!isLogin && !name) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Quay lại với tài khoản của bạn' : 'Tạo tài khoản mới để bắt đầu'}
        </Text>
      </View>

      <View style={styles.form}>
        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên của bạn</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên"
              placeholderTextColor="#ccc"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
        </Text>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} disabled={loading}>
          <Text style={styles.footerLink}>
            {isLogin ? 'Tạo tài khoản' : 'Đăng nhập'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: '#666',
  },
  footerLink: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
  },
});
