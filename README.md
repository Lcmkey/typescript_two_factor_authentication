# typescript_two_factor_authentication

---

# How to run

1. install package

    ```properties
    $ npm i
    ```

2. create `.env` file with below content in root directory

    ```properties
    APP_PORT=4000
    ```

3. run the application

    ```properties
    $ npm run dev
    ```

4. Install Authenticator

    -   Chrome Authenticator extension
    -   mobile App - Authy

5. Registor

    ```properties
    $ curl -X POST localhost:4000/api/register | jq
    ```

    output:

    ```json
    {
        "id": "af1fed53-a597-4356-b5b8-6bcc2c724cc3",
        "secret": "KMSUGQTNKR5UAWSALA2GOTCMENFSGODLORNSYVTVFRUXORCSF47A"
    }
    ```

6. add secret to Authenticator extension

   - Manualy add secret to chrom extension
     
       ![2FA][authenticator]
       

   - Add secret to authy through the `qrcode.png`
     
     ![2FA][qrcode]
     ![2FA][authy]

   - Call existing api to get token

       ```properties
       $ curl -X POST -H "Content-Type: application/json" -d '{"secret": "HRBVCPDFJEVEKT3FPEUHCN2JMZ2GYTJBINVXIJSEPJLG67LBOJEQ"}'  localhost:4000/api/getToken | jq
       ```

       output:
       ```
           {
           "token": "245422"
           }
       ```

7. Validate Secret

    ```properties
    $ curl -X POST -H "Content-Type: application/json" -d '{"userId": "af1fed53-a597-4356-b5b8-6bcc2c724cc3", "token": "955646"}'  localhost:4000/api/validate | jq
    ```

    output:

    ```json
    {
        "verified": false
    }
    ```

[//]: # (Image References)
[qrcode]: ./assert/qrcode.png
[authy]: ./assert/authy.jpeg
[authenticator]: ./assert/authenticator.png