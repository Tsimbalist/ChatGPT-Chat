import eel
from openai import OpenAI
from config import CHATGPT_CONFIG, EEL_SETTINGS

client = OpenAI(
    api_key=CHATGPT_CONFIG['api_key'],
)

eel.init('web')

@eel.expose
def get_chat_response(prompt):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": CHATGPT_CONFIG['role'],
                "content": prompt,
            }
        ],
        model=CHATGPT_CONFIG['version'],
    )
    return chat_completion.choices[0].message.content

eel.start('index.html', mode=EEL_SETTINGS['mode'], host=EEL_SETTINGS['host'], port=EEL_SETTINGS['port'], size=EEL_SETTINGS['size'])
