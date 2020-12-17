import * as React from 'react';
import { SafeAreaView, Image } from 'react-native';
import { appleAuthAndroid, AppleButton } from '@invertase/react-native-apple-authentication';
import { v4 as uuid } from 'uuid';
import appleLogoBlack from '../images/apple_logo_black.png';

export const SignIn = ({ navigation }) => {

  const doAppleLogin = async () => {
    // Gerando valores seguros e aleatórios para o state e rawNonce
    const rawNonce = uuid();
    const state = uuid();

    try {
      appleAuthAndroid.configure({
        // Service ID registrado no dashboard da Apple em https://developer.apple.com/account/resources/identifiers/list
        // Deve variar de acordo com a env
        clientId: "br.auth.technos.signin.debug",

        // Url de retorno criada no backend. O redirect é interceptado pela lib, porém, ainda deve ser uma url válida
        // A rota do backend nunca é chamada neste cenário.
        redirectUri: "https://homolog-mormaiismartwatches.grupotechnos.com.br/new_apple_session/redirect",

        //Quais informações eu quero de resposta? 'email name'
        //Nome e email só são fornecidos uma vez. Para testar outras vezes, desvincule seu apple id em https://appleid.apple.com/account/manage
        scope: appleAuthAndroid.Scope.ALL,
        
        // Quais tokens eu quero de resposta?
        responseType: appleAuthAndroid.ResponseType.ALL,

        // Coisas de auth com o Firebase. Acho que não vai ser preciso.
        // nonce: rawNonce,

        // Valor de estado exclusivo usado para prevenir ataques CSRF. Um UUID será gerado se nada for fornecido.
         state,
      });

      const response = await appleAuthAndroid.signIn();
      if (response) {
        console.warn("Logado!")
        console.log(response);
        const code = response.code; 
        const id_token = response.id_token; 
        const user = response.user; 
        const state = response.state;
        console.log("Auth code: ", code);
        console.log("Token ID: ", id_token);
        console.log("Usuário: ", user);
        console.log("State: ", state);
      }
    } catch (error) {
      if (error && error.message) {
        switch (error.message) {
          case appleAuthAndroid.Error.NOT_CONFIGURED:
            console.log("Falha na configuração. Rever método appleAuthAndroid.configure");
            break;
          case appleAuthAndroid.Error.SIGNIN_FAILED:
            console.log("Falha no login");
            break;
          case appleAuthAndroid.Error.SIGNIN_CANCELLED:
            console.log("Login cancelado pelo usuário");
            break;
          default:
            break;
        }
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#131313' }} >
      <AppleButton
        style={{ marginBottom: 10 }}
        cornerRadius={0}
        buttonStyle={AppleButton.Style.WHITE}
        buttonType={AppleButton.Type.SIGN_IN}
        onPress={() => doAppleLogin()}
        leftView={(
          <Image
            style={{
              alignSelf: 'center',
              width: 14,
              height: 14,
              marginRight: 7,
              resizeMode: 'contain',
            }}
            source={appleLogoBlack}
          />
        )}
      />
    </SafeAreaView>
  );
}