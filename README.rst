TideProviderJS
==============

Node/JS service which consumes tide gravity data from an AWS SQS Queue and publishes it via WebSocket using the
socket.io library.


Execution
---------

.. code-block::

    node bin/www


Environment Variables
---------------------
- PORT - Optional [default=3000]: Port for http server to listen on
- AWS_PROFILE - Optional [default=default]: Name of AWS profile from AWS credentials file to use
- SQS_URL - Required: AWS SQS endpoint URL
- DEBUG - Optional: Specify debug modules e.g. tideprovider:*

Note: AWS Credentials may be supplied by setting the environment variables:

    - AWS_ACCESS_KEY_ID
    - AWS_SECRET_ACCESS_KEY
    - AWS_DEFAULT_REGION

Or by creating an AWS credential file. See: https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html

Dependencies
------------
- aws-sdk
- express
- socket.io
- sqs-consumer



