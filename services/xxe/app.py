from flask import Flask, request, jsonify
from lxml import etree

app = Flask(__name__)


@app.get("/")
def index():
    return jsonify({
        "service": "xxe",
        "info": "POST XML to /parse to exercise lxml parser",
        "note": "This service is internal-only in docker-compose"
    })


@app.post("/parse")
def parse_xml():
    xml_body = request.data or b""
    try:
        # Intentionally resolving entities for XXE demonstration purposes
        parser = etree.XMLParser(load_dtd=True, no_network=False, resolve_entities=True)
        root = etree.fromstring(xml_body, parser=parser)
        # Return tag and text content for visibility
        return jsonify({
            "root_tag": root.tag,
            "text": (root.text or "").strip()
        })
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.post("/xml-contact")
def xml_contact():
    """Accept raw XML body, parse with entity resolution enabled, return root text."""
    xml_body = request.data or b""
    try:
        parser = etree.XMLParser(load_dtd=True, no_network=False, resolve_entities=True)
        root = etree.fromstring(xml_body, parser=parser)
        return jsonify({
            "ok": True,
            "root_tag": root.tag,
            "value": (root.text or "").strip()
        })
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.post("/import")
def import_file():
    """Accept uploaded XML file (multipart form field 'file') and parse with entity expansion."""
    if 'file' not in request.files:
        return jsonify({"error": "missing file"}), 400
    file = request.files['file']
    try:
        data = file.read()
        parser = etree.XMLParser(load_dtd=True, no_network=False, resolve_entities=True)
        root = etree.fromstring(data, parser=parser)
        return jsonify({
            "ok": True,
            "root_tag": root.tag,
            "value": (root.text or "").strip()
        })
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)



