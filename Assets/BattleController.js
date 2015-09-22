#pragma strict
var wizardGameObject: GameObject;
var thunderNovaGameObject: GameObject;
private var groundPlane = Plane(Vector3(0.0, 1.0, 0.0), Vector3(0, 0, 0));
private var wizard: Wizard;
private var wizardTargetPosition: Vector3;

function Start () {
	wizard = wizardGameObject.GetComponent(Wizard);
	wizardTargetPosition = wizardGameObject.transform.position;
}

function Update () {
	if(Input.GetMouseButtonUp(0)) {
		var ray: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var rayDistance: float;
		if(groundPlane.Raycast(ray, rayDistance)) {
			wizardTargetPosition = ray.GetPoint(rayDistance);
		}
	}
	if(null != wizardTargetPosition) {
		var targetDirection = wizardTargetPosition - wizardGameObject.transform.position;
		var velocity = targetDirection.normalized;
		wizardGameObject.GetComponent.<Rigidbody>().velocity = velocity;
	}
	var thunderNovaPosition = wizardGameObject.transform.position;
	thunderNovaPosition.y = 0;
	thunderNovaGameObject.transform.position = thunderNovaPosition;
}
